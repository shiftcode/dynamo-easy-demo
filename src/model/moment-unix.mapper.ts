import { MapperForType, NumberAttribute } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'

/**
 * store moment dates as unix timestamp instead of string values
 */
export const momentUnixMapper: MapperForType<moment.Moment, NumberAttribute> = {
  fromDb: attributeValue => moment.unix(parseInt(attributeValue.N, 10)),
  toDb: propertyValue => ({ N: `${propertyValue.unix()}` }),
}
