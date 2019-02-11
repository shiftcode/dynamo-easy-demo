import { LogInfo, LogLevel } from '@shiftcoders/dynamo-easy'

const LL = {
  [LogLevel.WARNING]: 'WARNING',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.DEBUG]: 'DEBUG',
}

export function createLogReceiver(maxLevel: LogLevel) {
  return (logInfo: LogInfo) => {
    if (logInfo.level <= maxLevel) {
      const msg = `[${LL[logInfo.level]}] ${new Date(logInfo.timestamp).toISOString()} ${logInfo.className} (${
        logInfo.modelConstructor
      }): ${logInfo.message}`
      console.debug(msg, logInfo.data)
    }
  }
}
