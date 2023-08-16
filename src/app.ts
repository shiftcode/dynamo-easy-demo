import { App, CfnOutput } from 'aws-cdk-lib'
import { CdkAppStack } from './app-stack'

export interface StackConfig {
  stackName: string
}

const app = new App()
const config: StackConfig = { stackName: 'dynamo-easy-demo' }
// tslint:disable-next-line:no-unused-expression
const stack = new CdkAppStack(app, config)

// tslint:disable:no-unused-expression
console.log(app.region)
console.log(stack.account)
