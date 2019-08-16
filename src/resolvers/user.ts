import { GraphQLResolvers, GraphQLUser, GraphQLUserRole } from './graphql-resolvers-types'
import { checkIsAuthenticated, checkJWTScopes, restrictToAdmins } from '../common/permissions'
import { getLoggedUser, createJWT, defaultResponseShape } from '../common/functions'
import { pubsub, APIEvents } from '../common/utils'
import { withFilter } from 'apollo-server'
import tweetResolvers from './tweet'
import { tweets, users } from '../../data'

const userResolvers: GraphQLResolvers = {
  // Field resolvers
  User: {
    url: (user) => `https://fake-twitter.com/user/${user.id}`,
    photo: (user) => `https://fake-twitter.com/photo/user-${user.id}.jpg`,
    tweets: (user, args, context, infos) => (
      // @ts-ignore Call the tweets resolver with user filter
      tweetResolvers.Query.tweets({}, { ...args, ofUser: user.id }, context, infos)
    ),
    numberOfTweets: (user) => tweets.filter(tweet => tweet.authorId === user.id).length,
  },

  Query: {
    async me(_, {}, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['users:me'])
      const currentUser = await getLoggedUser(context)

      return users.find(users => (
        users.id === currentUser!.id
      )) as GraphQLUser;
    },
    async user(_, { id }) {
      return users.find(user => user.id === id) as GraphQLUser;
    },
  },
  Mutation: {
    async auth(_, args) {
      const username = args.username.toLowerCase()
      let user = users.find(user => user.username === username)

      // Create a new user if not found
      if (!user) {
        const newUser: typeof users[0] = {
          id: String(users.length + 1),
          username,
          role: GraphQLUserRole.User,
          createdAt: Date.now(),
        }
        users.push(newUser)
        pubsub.publish(APIEvents.USER_ADDED, { userAdded: newUser })
        user = newUser
      }

      const jwt = await createJWT(user.id, 'GraphQL auth')
      return {
        token: `Bearer ${jwt.token}`,
        expiresIn: jwt.expiresIn.getTime(),
      };
    },

    async updateMe(_, { input }, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['users:updateme'])
      const currentUser = await getLoggedUser(context)
      
      // Validate username
      if (input.username) {
        if (input.username === 'null' || input.username === 'undefined') {
          return defaultResponseShape({
            success: false,
            message: 'Nice try. Invalid username input',
          })
        }

        const usernameAlreadyTaken = users.find(user => user.username === input.username)
        if (usernameAlreadyTaken) {
          return defaultResponseShape({
            success: false,
            message: 'Username already taken! Try another',
          });
        }
      }

      const userIndex = users.findIndex(user => user.id === currentUser.id)
      const oldInfos = users[userIndex]
      const updatedInfos = Object.assign(oldInfos, {
        username: input.username!.toLowerCase()
      })
      // Update user
      users.splice(userIndex, 1, updatedInfos)

      return defaultResponseShape({
        success: true,
        message: 'User updated successfully!',
        node: updatedInfos as GraphQLUser
      });
    },
    async deleteMe(_, {}, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['users:deleteme'])
      const currentUser = await getLoggedUser(context)

      const userIndex = users.findIndex(user => user.id === currentUser.id)
      // Delete user
      users.splice(userIndex, 1)

      return defaultResponseShape({
        success: true,
        message: 'User deleted successfully!',
      });
    },
  },
  Subscription: {
    userAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(APIEvents.USER_ADDED),
        async (payload, variables, context) => {
          console.log('subscription context', context)
          await restrictToAdmins(context)
          return true;
        }
      )
    },
  },
};

export default userResolvers
