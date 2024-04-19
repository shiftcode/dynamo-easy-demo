import configData from '../cf-outputs.json' with { type: 'json' }

interface CfOutput {
  OutputKey: string
  OutputValue: string
}

type CfOutputs = CfOutput[]

export interface Config {
  accessKeyId: string
  secretAccessKey: string
  CfStackNameServices: string
  AwsRegion: string
}

export const CONFIG: Config = <Config>(
  (<CfOutputs>configData).reduce((u, i) => ({ ...u, [i.OutputKey]: i.OutputValue }), {})
)
