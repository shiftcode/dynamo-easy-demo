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
  
## credentials / security
This demo uses a cognito identity pool for unauthenticated read access to those 3 tables only - which means no write operations will succeed.
It's meant for you to play around with it directly in stackblitz or to clone it and test it out on your own stack.

## infrastructure
You can deploy the whole stack trough CloudFormation (leveraging aws-cdk), execute the following to deploy a Stack to your account.
- `npm i`
- ?? update config to define which account ??
- `cdk bootstrap`
- `npm run deploy` (if you want you can run `npm run synth` to see the CloudFormation template in the console)

# Made with ❤ by [shiftcode.ch](https://www.shiftcode.ch)
