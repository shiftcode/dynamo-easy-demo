import { LogLevel, updateDynamoEasyConfig } from '@shiftcoders/dynamo-easy'
import { dynamoEasyDemoTableNameResolver } from './static/table-name-resolver.function.js'
import { fnsDateIsoMapper } from './model/fns-date-iso.mapper.js'
import { createLogReceiver } from './static/my-log-receiver.function.js'

export function createDynamoEasyConfig() {
  updateDynamoEasyConfig({
    // used to extend the table names with the stack name
    tableNameResolver: dynamoEasyDemoTableNameResolver,
    // used to define the mapper for all @DateProperty decorated fields
    dateMapper: fnsDateIsoMapper,
    // used to receive all log statements from dynamo-easy
    logReceiver: createLogReceiver(LogLevel.INFO),
  })
}
