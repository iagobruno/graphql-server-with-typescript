import merge from 'lodash.merge'
import { URLResolver, PositiveIntResolver, DateTimeResolver } from 'graphql-scalars'
import userResolvers from './user'
import tweetResolvers from './tweet'

const customScalarsResolvers = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  PositiveInt: PositiveIntResolver,
}

// Combine all resolvers
const allResolvers = merge(
  customScalarsResolvers,
  userResolvers,
  tweetResolvers,
)

export default allResolvers as any
