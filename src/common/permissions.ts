import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { Context } from './utils'

/**
 * List of available scopes for use at the time of creating JWT tokens
 * and for resolvers to verify if the token has access permission.
 */
export enum AvailableScopes {
  'read:users',
  'write:users',
  'read:tweets',
  'write:tweets',
}

/**
 * Check if JWT token received in the request has the necessary privileges to access this feature.
 * @throws If token does not contain the required scope.
 * @returns Returns true if the test passes.
 *
 * @example
 * async resolver(_, args, context) {
  *   await checkIsAuthenticated(context)
  *   await checkIfTokenHasPermission(context, 'write:users')
  *   ...
  * }
 */
export async function checkIfTokenHasPermission (context: Context, requiredScope: keyof typeof AvailableScopes) {
  const tokenScopes = context.jwtPayload!.scopes
  const hasPermission = tokenScopes.some(scope => scope === requiredScope)

  if (!hasPermission) throw new ForbiddenError('The received token is not allowed to access this feature.')

  return true
}

/**
 * Function to be used within resolvers to check if is there logged in user in the request.
 * @throws Throws an error if no users are found.
 * @returns Returns true if the test passes.
 *
 * @example
 * async resolver(_, args, context) {
  *   await checkIsAuthenticated(context)
  *   ...
  * }
 */
export async function checkIsAuthenticated (context: Context) {
  if (typeof context.user === 'undefined') {
    throw new AuthenticationError('You must be logged in')
  }

  return true
}

/**
 * Function to be used within resolvers to prevent unauthorized access.
 * @throws Throws an error if the user is not an administrator.
 * @returns Returns true if the test passes.
 *
 * @example
 * async resolver(_, args, context) {
 *   await checkIsAuthenticated(context)
 *   await restrictToAdmins(context)
 *   ...
 * }
 */
export async function restrictToAdmins (context: Context) {
  if (typeof context.user === 'undefined' || context.user.role !== 'ADMIN') {
    throw new ForbiddenError('You do not have permission to access this feature.')
  }

  return true
}

/**
 * Function to be used within resolvers to prevent a user from modifying
 * information or things from other users.
 * @param ownerId Item owner id.
 * @throws Throw an error if the id of the logged in user is not the same as the id received in "ownerId" argument.
 * @returns Returns true if the test passes.
 *
 * @example
 * async resolver(_, args, context) {
 *   await checkIsAuthenticated(context)
 *   const tweet = tweets.find(...)
 *   await restrictToOwner(context, tweet.authorId)
 *   ...
 * }
 */
export async function restrictToOwner (context: Context, ownerId: string) {
  if (typeof context.user === 'undefined' || context.user.id !== ownerId) {
    throw new ForbiddenError('You do not have permission to access this feature or perform this action.')
  }

  return true
}
