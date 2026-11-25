# dynamo-easy demo

[![dynamo-easy](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-LVwl0DaP3nICLR8V49z%2Favatar.png?generation=1549468480887077&alt=media)](https://github.com/shiftcode/dynamo-easy)

This project serves as a showcase how [dynamo-easy](https://github.com/shiftcode/dynamo-easy) can be used.

Imagine a system where every employee of a company logs their work time per project with a start time and duration.
There are three models, each with its own table and a service in `src/services`: `Project`, `Employee` and `TimeEntry`.

`src/index.ts` contains two demo flows:

- `read()` – queries, scans, gets and index lookups. Always runs.
- `write()` – batch writes, updates, transactions. Only runs when `DEMO_WRITE=true` (or `1`) is set.

## Getting started

Requires Node.js >= 22. Run `npm install`, then pick one of the following setups.

### Public demo stack (read only)

```sh
npm start
```

The stack in `eu-central-1` grants unauthenticated read access to the three tables via a Cognito identity pool, so write operations fail.

### Local DynamoDB with Docker

The image in `local-dynamodb/` creates the three tables (`local-dynamodb/tables/*.json`, mirroring `infrastructure.yml`).
Setting `DYNAMO_ENDPOINT` makes the demo use that endpoint instead of the Cognito credentials.

```sh
docker build -t dynamo-easy-demo-db local-dynamodb
docker run --rm -d --name dynamo-easy-demo-db -p 8000:8000 dynamo-easy-demo-db

DYNAMO_ENDPOINT=http://localhost:8000 DEMO_WRITE=true npm start

docker stop dynamo-easy-demo-db # all data is gone
```

Every container starts with empty tables, so run with `DEMO_WRITE=true` at least once. Each further write run adds more random time entries.

### Your own AWS stack

`npm run deploy` deploys `infrastructure.yml` via CloudFormation and writes the stack outputs to `src/cf-outputs.json`.
The anonymous Cognito role only gets read permissions; to use `DEMO_WRITE=true`, also grant it `dynamodb:PutItem`, `UpdateItem`, `BatchWriteItem` and `ConditionCheckItem`.

## Made with ❤ by [shiftcode.ch](https://www.shiftcode.ch)
