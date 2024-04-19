# dynamo-easy demo
[![dynamo-easy](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-LVwl0DaP3nICLR8V49z%2Favatar.png?generation=1549468480887077&alt=media)](https://github.com/shiftcode/dynamo-easy)

This project serves as a showcase how [dynamo-easy](https://github.com/shiftcode/dynamo-easy) can be used.

Imagine a system where every employee of a company logs his work time per project with a start time and duration.
We use three models each with its table

- Project

- Employee

- TimeEntries

For each model there is a service to execute different operations on the tables.
Write operations are not permitted with the applied IAM Policy. If you want to try these operations out deploy the stack to your own AWS account.
  
## Credentials / Security
This demo uses an AWS Access Key (crated through the CloudFormation stack) to have read access to those 3 tables only -
which means no write operations will succeed.
It's meant for you to play around with it directly in stackblitz or to clone it and test it out on your own stack.

## Infrastructure
You can deploy the whole stack trough `aws-cdk`. Just run `npm run deploy` to deploy the CloudFormation Stack to your
account and get the relevant `Outputs`. Ensure that the `aws-cdk` is able to resolve credentials with enough permissions
to create a stack.
To fill the `DynamoDB` tables with some sample data run `npm run init-data` and then run `npm run start` to see the
output.

# Made with ❤ by [shiftcode.ch](https://www.shiftcode.ch)
