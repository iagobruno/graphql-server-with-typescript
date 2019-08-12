import { GraphQLResolvers, GraphQLTweet } from './resolvers-types'
import { generatePaginatedConnection } from './common'
import * as data from '../data'
let { users, tweets } = data

const resolvers: GraphQLResolvers = {
  Node: {
    // @see https://www.apollographql.com/docs/graphql-tools/resolvers/#unions-and-interfaces
    __resolveType(obj: any) {
      if (obj.content) return 'Tweet';
      else if (obj.name) return 'User';
      else return null;
    }
  },
  Query: {
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
    createTweet(_, { input }) {
      const newTweet: Omit<GraphQLTweet, 'url' | 'author'> = {
        id: String(tweets.length + 1),
        content: input.content,
        authorId: input.authorId,
        createdAt: Date.now(),
      }

      tweets.push(newTweet)
      return newTweet as any
    },
    deleteTweet(_, { id }) {
      tweets = tweets.filter(tweet => tweet.id !== id)
      return 'Deleted!';
    }
  },
  Tweet: {
    url: (tweet) => `https://fake-twitter.com/user/${tweet.authorId}/status/${tweet.id}`,
    author: (tweet) => users.find(user => user.id === tweet.authorId) as any,
  },
  User: {
    url: (user) => `https://fake-twitter.com/user/${user.id}`,
    photo: (user) => `https://fake-twitter.com/user/${user.id}.jpg`,
    tweets: (user, args, context, infos) => (
      // @ts-ignore Call the tweets resolver with user filter
      resolvers.Query.tweets({}, { ...args, ofUser: user.id }, context, infos)
    ),
  }
}

export default resolvers
