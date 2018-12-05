import { LogInfo, LogLevel } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'

export function createLogReceiver(...levels: LogLevel[]) {
  return (logInfo: LogInfo) => {
    if (levels.includes(logInfo.level)) {
      const msg = `[${logInfo.level}] ${moment(logInfo.timestamp).format('L LT')} ${logInfo.className} (${
        logInfo.modelClass
      }): ${logInfo.message}`
      console.debug(msg, logInfo.data)
    }
  }
}
