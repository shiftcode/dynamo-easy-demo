import { CONFIG } from '../static/config'

export class AnonymousAuthService {
  constructor() {}

  readonly sessionValidityEnsurer: () => Promise<void> = () => {
    // not necessary to create or ensure session, since AllowUnauthenticatedIdentities:true is used on IdentityPool
    return Promise.resolve()
  }
}
