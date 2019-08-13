import { ApolloServer, AuthenticationError } from 'apollo-server'
import { green } from 'colors'
import 'graphql-import-node/register'
import { Context, verifyJWT, findUserById } from './common'

import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'

const port = process.env.PORT || 4000
const server = new ApolloServer({
  typeDefs,
  resolvers,
  async context({ req }) {
    const context: Context = {}

    const jwtPayload = await verifyJWT(req, false)
    // Add information of the user that is trying to access the route if the request contains a token.
    if (jwtPayload !== null) {
      const user = findUserById(jwtPayload.subject)
      if (!user) throw new AuthenticationError('User not found');

      context.user = user
      context.jwtPayload = jwtPayload
    }

    return context
  },
  playground: true,
  debug: true,
});

server.listen({ port }).then(({ url }) => {
  console.log(green(`🚀  Server ready at ${url}graphql`))
})
