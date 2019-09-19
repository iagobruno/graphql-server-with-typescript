import 'graphql-import-node/register'
import Root from './Root.graphql'
import User from './User.graphql'
import Tweet from './Tweet.graphql'

// Combine all schemas
const typeDefs = [
  Root,
  User,
  Tweet,
]

export default typeDefs
