import { GraphQLResolvers, GraphQLTweet, GraphQLUser, GraphQLUserRole } from './resolvers-types'
import { Context, createJWT, generatePaginatedConnection } from './common'
import { checkIsAuthenticated, checkJWTScopes, checkIfLoggedUserIsTheOwner } from './permissions'
import * as data from '../data'
let { users, tweets } = data

const resolvers: GraphQLResolvers<Context> = {
  Node: {
    // @see https://www.apollographql.com/docs/graphql-tools/resolvers/#unions-and-interfaces
    __resolveType(obj: any) {
      if (obj.content) return 'Tweet';
      else if (obj.name) return 'User';
      else return null;
    }
  },
  Query: {
    async me(_, {}, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['users:me'])

      return users.find(users => (
        users.id === context.user.id
      )) as GraphQLUser;
    },
    async user(_, { id }) {
      return users.find(user => user.id === id) as GraphQLUser;
    },

    tweets(_, { first, after, ofUser }) {
      // Validate arguments
      first = Math.max(0, Math.min(50, first))

      let allTweets = tweets as Array<GraphQLTweet>

      // Filter by user
      if (ofUser) {
        allTweets = allTweets.filter(tweet => tweet.authorId == ofUser)
      }

      // Sort by most recent
      allTweets = allTweets.sort((a, b) => b.createdAt - a.createdAt)

      // If the request contains an id in "after" argument, look for the index of the item
      // to indicate where the paging should start
      let startIndex = 0
      if (after) {
        startIndex = allTweets.findIndex(tweet => tweet.id === after) + 1
      }

      // Apply pagination
      const nodes = allTweets.slice(startIndex, startIndex + first)

      return generatePaginatedConnection<GraphQLTweet>({
        allNodes: allTweets,
        nodes,
        firstArg: first,
        startIndex
      });
    },
    tweet(_, { id }) {
      return tweets.find(tweet => tweet.id === id) as GraphQLTweet
    },

  },
  Mutation: {
    async auth(_, { input }) {
      const username = input.username.toLowerCase()
      let user = users.find(user => user.username === username)

      // Create a new user if not found
      if (!user) {
        const newUser: Omit<GraphQLUser, 'tweets' | 'url' | 'photo'> = {
          id: String(users.length + 1),
          username,
          role: GraphQLUserRole.User,
          createdAt: Date.now(),
        }
        users.push(newUser)
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

      const userIndex = users.findIndex(user => user.id === context.user.id)
      const oldInfos = users[userIndex]
      const updatedInfos = Object.assign(oldInfos, {
        username: input.username.toLowerCase()
      })

      users.splice(userIndex, 1, updatedInfos)
      return updatedInfos as GraphQLUser;
    },
    async deleteMe(_, {}, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['users:deleteme'])

      const userIndex = users.findIndex(user => user.id === context.user.id)
      if (userIndex === -1) {
        return 'User not found';
      }

      users.splice(userIndex, 1)
      return 'Deleted!';
    },

    async createTweet(_, { input }, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['tweets:create'])

      const newTweet: Omit<GraphQLTweet, 'url' | 'author'> = {
        id: String(tweets.length + 1),
        content: input.content,
        authorId: context.user!.id,
        createdAt: Date.now(),
      }

      tweets.push(newTweet)
      return newTweet as any;
    },
    async deleteTweet(_, { id }, context) {
      await checkIsAuthenticated(context)
      await checkJWTScopes(context, ['tweets:delete'])

      const tweetIndex = tweets.findIndex(tweet => tweet.id === id)
      if (tweetIndex === -1) {
        return 'Tweet not found';
      }

      await checkIfLoggedUserIsTheOwner(context, tweets[tweetIndex].authorId)

      tweets.splice(tweetIndex, 1)
      return 'Deleted!';
    }
  },
  Tweet: {
    url: (tweet) => `https://fake-twitter.com/user/${tweet.authorId}/status/${tweet.id}`,
    author: (tweet) => users.find(user => user.id === tweet.authorId) as any,
  },
  User: {
    url: (user) => `https://fake-twitter.com/user/${user.id}`,
    photo: (user) => `https://fake-twitter.com/photo/user-${user.id}.jpg`,
    tweets: (user, args, context, infos) => (
      // @ts-ignore Call the tweets resolver with user filter
      resolvers.Query.tweets({}, { ...args, ofUser: user.id }, context, infos)
    ),
  }
}

export default resolvers
