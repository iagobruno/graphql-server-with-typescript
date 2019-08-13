import { GraphQLResolvers, GraphQLTweet } from './graphql-resolvers-types'
import { checkIsAuthenticated, checkJWTScopes, restrictToOwner } from '../common/permissions'
import { encode, decode, defaultConnectionShape, getLoggedUser, defaultResponseShape } from '../common/functions'
import { pubsub, APIEvents } from '../common/utils'
import userResolvers from './user'
import { tweets } from '../../data'

const tweetResolvers: GraphQLResolvers = {
  // Field resolvers
  Tweet: {
    url: (tweet) => `https://fake-twitter.com/user/${tweet.authorId}/status/${tweet.id}`,
    author: (tweet, args, context, infos) => (
      // @ts-ignore
      userResolvers.Query!.user(null, { ...args, id: tweet.authorId }, context, infos)
    ),
  },
  TweetConnection: {
    edges: (parent) => parent.nodes.map(node => ({
      cursor: encode(node.id),
      node,
    })) as any,
  },

  Query: {
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
  },
}

export default tweetResolvers
