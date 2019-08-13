import { ApolloServer, makeExecutableSchema, AuthenticationError } from 'apollo-server'
import { green } from 'colors'
import 'graphql-import-node/register'
import { Context, verifyJWT, findUserById } from './common'

import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
})

const port = process.env.PORT || 4000
const server = new ApolloServer({
  schema,
  playground: true,
  debug: true,
  async context({ req, connection }) {
    if (connection) return connection.context;

    // Authenticate via HTTP request
    const jwtPayload = await verifyJWT(req.headers.authorization || '', false)
    if (jwtPayload !== null) {
      const user = findUserById(jwtPayload.subject)
      if (!user) throw new AuthenticationError('User not found');

      const context: Context = {
        user,
        jwtPayload
      }
      return context;
    }
  },
  subscriptions: {
    // ! I didn't test this because graphql-playground does not allow to define the "connectionParams" !
    async onConnect({ authToken }: any) {
      // Authenticate via WebSocket
      if (authToken) {
        const jwtPayload = await verifyJWT(authToken, false)
        // Add information of the user that is trying to access the route if the request contains a token.
        if (jwtPayload !== null) {
          const user = findUserById(jwtPayload.subject)
          if (!user) throw new AuthenticationError('User not found');
          return {
            user,
            jwtPayload,
          };
        }
      }
    }
  }
});

server.listen({ port }).then(({ url }) => {
  console.log(green(`🚀  Server ready at ${url}graphql`))
})
