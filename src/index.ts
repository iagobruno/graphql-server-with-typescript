import { ApolloServer } from 'apollo-server'
import { green } from 'colors'
import 'graphql-import-node/register'
import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
});

server.listen().then(({ url }) => {
  console.log(green(`🚀  Server ready at ${url}graphql`))
})
