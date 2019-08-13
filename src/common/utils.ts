import { PubSub } from 'apollo-server'
import { JWTPayload } from './functions'
import { users } from '../../data'

/**
 * The shape of context object passed to all resolvers in api.
 */
export interface Context {
  user?: typeof users[0],
  jwtPayload?: JWTPayload,
}

/** @see https://www.apollographql.com/docs/apollo-server/features/subscriptions/ */
export const pubsub = new PubSub()
/**
 * List of events that are triggered by resolvers.
 */
export enum APIEvents {
  TWEET_ADDED = 'TWEET_ADDED',
  USER_ADDED = 'USER_ADDED',
}
