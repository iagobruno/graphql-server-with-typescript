import { GraphQLResolvers, GraphQLTweet, GraphQLUser, GraphQLUserRole } from './resolvers-types'
import { createJWT, pubsub, getLoggedUser, defaultResponseShape, defaultConnectionShape } from './common'
import { Context, APIEvents, encode, decode } from './common'
import { checkIsAuthenticated, checkJWTScopes, restrictToOwner, restrictToAdmins } from './permissions'
import { withFilter } from 'apollo-server'
import * as data from '../data'
let { users, tweets } = data

const resolvers: GraphQLResolvers<Context> = {
  // Field resolvers
  User: {
    url: (user) => `https://fake-twitter.com/user/${user.id}`,
    photo: (user) => `https://fake-twitter.com/photo/user-${user.id}.jpg`,
    tweets: (user, args, context, infos) => (
      // @ts-ignore Call the tweets resolver with user filter
      resolvers.Query.tweets({}, { ...args, ofUser: user.id }, context, infos)
    ),
    numberOfTweets: (user) => tweets.filter(tweet => tweet.authorId === user.id).length,
  },
  Tweet: {
    url: (tweet) => `https://fake-twitter.com/user/${tweet.authorId}/status/${tweet.id}`,
    author: (tweet) => users.find(user => user.id === tweet.authorId) as any,
  },
  TweetConnection: {
    edges: (parent) => parent.nodes.map(node => ({
      cursor: encode(node.id),
      node,
    })) as any,
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

    tweets(_, { first, after, ofUser }) {
      // Validate arguments
      first = Math.max(0, Math.min(50, first))
      const cursor = after ? decode(after) : null

      let allTweets = tweets as Array<GraphQLTweet>

      // Filter by user
      if (ofUser) {
        allTweets = allTweets.filter(tweet => tweet.authorId == ofUser)
      }

      // Sort by most recent
      allTweets = allTweets.sort((a, b) => b.createdAt - a.createdAt)

      // If the request contains an cursor in "after" argument, look for the index of the item
      // to indicate where the paging should start
      let startIndex = 0
      if (cursor) {
        startIndex = allTweets.findIndex(tweet => tweet.id === cursor) + 1
      }

      // Apply pagination
      const nodes = allTweets.slice(startIndex, startIndex + first)

      return defaultConnectionShape<GraphQLTweet>({
        allNodes: allTweets,
        nodes,
        firstArg: first,
        startIndex
      }) as any;
    },
    tweet(_, { id }) {
      return tweets.find(tweet => tweet.id === id) as GraphQLTweet
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

    async createTweet(_, { input }, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['tweets:create'])
      const currentUser = await getLoggedUser(context)

      const newTweet: Omit<GraphQLTweet, 'url' | 'author'> = {
        id: String(tweets.length + 1),
        content: input.content,
        authorId: currentUser.id,
        createdAt: Date.now(),
      }
      // Create tweet
      tweets.push(newTweet)
      pubsub.publish(APIEvents.TWEET_ADDED, { tweetAdded: newTweet })

      return defaultResponseShape({
        success: true,
        message: 'Successfully created tweet!',
        node: newTweet as GraphQLTweet,
      });
    },
    async deleteTweet(_, { id }, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['tweets:delete'])

      const tweetIndex = tweets.findIndex(tweet => tweet.id === id)
      if (tweetIndex === -1) {
        return defaultResponseShape({
          success: false,
          message: 'Tweet not found',
        });
      }
      await restrictToOwner(context, tweets[tweetIndex].authorId)
      // Delete tweet
      tweets.splice(tweetIndex, 1)

      return defaultResponseShape({
        success: true,
        message: 'Successfully deleted tweet!',
      });
    },
  },
  Subscription: {
    tweetAdded: {
      subscribe: () => pubsub.asyncIterator(APIEvents.TWEET_ADDED)
    },
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
}

export default resolvers as any
