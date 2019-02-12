// Depending on whether rollup is used, cf-outputs.json needs to be imported differently.
// Since jsons don't have a default exports, we normally need to import using the `* as` syntax.
// However, rollup creates a synthetic default module and we thus need to import it using the `default as` syntax.
import * as _configData from '../cf-outputs.json'
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupConfigData } from '../cf-outputs.json'
const configData = _rollupConfigData || _configData

interface CfOutput {
  OutputKey: string
  OutputValue: string
}

type CfOutputs = CfOutput[]

export interface Config {
  CfStackNameServices: string
  AwsRegion: string
  CognitoIdentityPoolId: string
}

export const CONFIG: Config = <Config>(
  (<CfOutputs>configData).reduce((u, i) => ({ ...u, [i.OutputKey]: i.OutputValue }), {})
)
