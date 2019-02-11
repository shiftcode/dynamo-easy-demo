import * as AWS from 'aws-sdk'
import { CONFIG } from '../static/config'

export class AnonymousAuthService {
  constructor() {
    AWS.config.region = CONFIG.AwsRegion
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: CONFIG.CognitoIdentityPoolId,
    })
  }

  readonly sessionValidityEnsurer: () => Promise<void> = () => {
    // not necessary to create or ensure session, since AllowUnauthenticatedIdentities:true is used on IdentityPool
    return Promise.resolve()
  }
}
