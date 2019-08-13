import merge from 'lodash.merge'
import userResolvers from './user'
import tweetResolvers from './tweet'

// Combine all resolvers
const allResolvers = merge(
  userResolvers,
  tweetResolvers,
)

export default allResolvers as any
