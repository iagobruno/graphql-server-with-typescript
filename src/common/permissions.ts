import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { Context } from './utils'

/**
 * List of available scopes for use at the time of creating JWT tokens
 * and for resolvers to verify if the token has access permission.
 */
export enum Scopes {
  /** "tweets" scope inherits all tweets privileges: "create", "delete", ... */
  'tweets',
  'tweets:create',
  'tweets:delete',
  /** "users" scope inherits all users privileges: "me", "updateme", "deleteme", ... */
  'users',
  'users:me',
  'users:updateme',
  'users:deleteme',
}
export type ScopesArray = Array<keyof typeof Scopes>

/**
 * Check if the JWT token received in the request has the necessary privileges to access this feature.
 * @param scopesToCheck List of scopes to check.
 * @throws Throws an error if the token does not contain some of the required scopes received in "scopesToCheck".
 * @returns Returns true if the test passes.
 *
 * @example
 * async resolver(_, args, context) {
  *   await checkIsAuthenticated(context)
  *   await checkJWTScopes(context, ['users:deleteme'])
  *   ...
  * }
 */
export async function checkJWTScopes(context: Context, scopesToCheck: ScopesArray) {
  if (typeof context.jwtPayload === 'undefined') {
    throw new ForbiddenError('No jwt token was found');
  }
  const scopesInJWT = context.jwtPayload.scopes

  scopesToCheck.forEach(requiredScope => {
    /** The first part before the ":" */
    const schemaOfRequiredScope = requiredScope.split(':')[0] as any

    if (
      !scopesInJWT.includes(requiredScope) &&
      // Also check if the token has access to all scope schema methods
      !scopesInJWT.includes(schemaOfRequiredScope)
    ) {
      throw new ForbiddenError('The received token is not allowed to access this feature.');
    }
  })

  return true;
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
export async function checkIsAuthenticated(context: Context) {
  if (typeof context.user === 'undefined') {
    throw new AuthenticationError('You must be logged in');
  }

  return true;
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
export async function restrictToAdmins(context: Context) {
  if (typeof context.user === 'undefined' || context.user.role !== 'ADMIN') {
    throw new ForbiddenError('You do not have permission to access this feature.');
  }

  return true;
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
export async function restrictToOwner(context: Context, ownerId: string) {
  if (typeof context.user === 'undefined' || context.user.id !== ownerId) {
    throw new ForbiddenError('You do not have permission to access this feature or perform this action.');
  }

  return true;
}
