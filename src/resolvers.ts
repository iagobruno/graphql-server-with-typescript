import { GraphQLResolvers } from './resolvers-types'
import data from '../data'

const resolvers: GraphQLResolvers = {
  Query: {
    hello() {
      return 'world'
    }
  },
}

export default resolvers
