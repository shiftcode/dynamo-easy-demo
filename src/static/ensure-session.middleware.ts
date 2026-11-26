import type { DynamoDBClient } from '@aws-sdk/client-dynamodb'

/**
 * Registers a middleware on the client's middleware stack which makes sure the aws credentials are set and valid
 * before any request is sent to DynamoDB.
 * @see https://github.com/aws/aws-sdk-js-v3#middleware-stack
 */
export function addEnsureSessionMiddleware(client: DynamoDBClient): void {
  client.middlewareStack.add(
    (next) => async (args) => {
      await ensureSession()
      return next(args)
    },
    { step: 'initialize', name: 'ensureSessionMiddleware' },
  )
}

function ensureSession(): Promise<void> {
  // not necessary to create or ensure session, since AllowUnauthenticatedIdentities:true is used on IdentityPool
  return Promise.resolve()
}
