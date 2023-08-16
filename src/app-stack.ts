import { CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib'
// tslint:disable-next-line:no-submodule-imports
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb'
// tslint:disable-next-line:no-submodule-imports
import { CfnAccessKey, Effect, PolicyStatement, User } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { StackConfig } from './app'

export class CdkAppStack extends Stack {
  constructor(scope: Construct, { stackName }: StackConfig) {
    super(scope, stackName)

    // The code that defines your stack goes here
    const user = new User(this, 'DynamoDBUser', { userName: 'dynamo-user' })

    /*
     * dynamo tables
     */
    const tableEmployee = new Table(this, 'TableEmployee', {
      tableName: `${stackName}-employees`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'email', type: AttributeType.STRING },
    })

    const tableProjects = new Table(this, 'TableProject', {
      tableName: `${stackName}-projects`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'clientSlug', type: AttributeType.STRING },
      sortKey: { name: 'slug', type: AttributeType.STRING },
    })

    const tableTimeEntries = new Table(this, 'TimeEntries', {
      tableName: `${stackName}-timeEntries`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'monthEmail', type: AttributeType.STRING },
      sortKey: { name: 'startDate', type: AttributeType.STRING },
    })

    tableTimeEntries.addGlobalSecondaryIndex({
      indexName: 'clientProject-unixTsUserId-index',
      partitionKey: { name: 'clientProject', type: AttributeType.STRING },
      sortKey: { name: 'unixTsUserId', type: AttributeType.NUMBER },
      projectionType: ProjectionType.ALL,
    })

    user.addToPrincipalPolicy(
      new PolicyStatement({
        actions: ['dynamodb:*'],
        effect: Effect.ALLOW,
        resources: [tableEmployee.tableArn, tableProjects.tableArn, tableTimeEntries.tableArn],
      })
    )

    user.applyRemovalPolicy(RemovalPolicy.DESTROY)

    const accessKey = new CfnAccessKey(this, 'accessKey', { userName: user.userName })

    // tslint:disable:no-unused-expression
    new CfnOutput(this, 'CfStackNameServices', { exportName: 'CfStackNameServices', value: stackName })
    new CfnOutput(this, 'AwsRegion', { exportName: 'AwsRegion', value: this.region ?? 'unknown' })
    new CfnOutput(this, 'accessKeyId', { value: accessKey.ref })
    new CfnOutput(this, 'secretAccessKey', { value: accessKey.attrSecretAccessKey })
  }
}
