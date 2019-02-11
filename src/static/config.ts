import * as configData from '../cf-outputs.json'

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
