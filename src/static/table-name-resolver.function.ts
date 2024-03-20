import { TableNameResolver } from '@shiftcoders/dynamo-easy'
import { CONFIG } from './config.js'

export const dynamoEasyDemoTableNameResolver: TableNameResolver = (tableName: string) => {
  return `${CONFIG.CfStackNameServices}-${tableName}`
}
