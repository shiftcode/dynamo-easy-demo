import { App, CfnOutput } from 'aws-cdk-lib'
import { CdkAppStack } from './app-stack.js'

export interface StackConfig {
  stackName: string
}

const app = new App()
const config: StackConfig = { stackName: 'dynamo-easy-demo' }
// tslint:disable-next-line:no-unused-expression
new CdkAppStack(app, config)
