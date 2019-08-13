import { ApolloServer, makeExecutableSchema, AuthenticationError } from 'apollo-server'
import { Request, Response } from 'express'
import { green } from 'colors'
import { GraphQLError } from 'graphql'
// @ts-ignore
import queryDepthLimit from 'graphql-depth-limit'
// @ts-ignore
import queryComplexityLimit from 'graphql-cost-analysis'
import { Context } from './common/utils'
import { verifyJWT, findUserById } from './common/functions'
import typeDefs from './types'
import resolvers from './resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
})

/**
 * Hack to make graphql-query-complexity work with Apollo Server v2
 * Stolen from https://github.com/withspectrum/spectrum/blob/caa361a402592c5455b99c575702b3d7cf3ab5b5/api/apollo-server.js#L21
 */
class ProtectedApolloServer extends ApolloServer {
  async createGraphQLServerOptions(req: Request, res: Response) {
    const options = await super.createGraphQLServerOptions(req, res)
    return Object.assign(options, {
      validationRules: [
        // See more: https://github.com/stems/graphql-depth-limit
        queryDepthLimit(5),
        // See more: https://github.com/pa-bru/graphql-cost-analysis
        queryComplexityLimit({
          maximumCost: 50,
          defaultCost: 0,
          variables: req.body.variables,
          onComplete(complexity: number) {
            // console.log('query complexity:', complexity)
          },
          createError(max: number, actual: number) {
            return new GraphQLError(`The query exceeds the maximum complexity of ${max}. Actual complexity is ${actual}`);
          }
        })
      ]
    });
  }
}

const server = new ProtectedApolloServer({
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

const port = process.env.PORT || 4000
server.listen({ port }).then(({ url }) => {
  console.log(green(`🚀  Server ready at ${url}graphql`))
})
