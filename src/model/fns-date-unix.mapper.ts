import { MapperForType, NumberAttribute } from '@shiftcoders/dynamo-easy'
import { FnsDate } from '../static/fns-date'

/**
 * store Dates as unix timestamp instead of string values
 */
export const fnsDateUnixMapper: MapperForType<FnsDate, NumberAttribute> = {
  fromDb: attributeValue => new FnsDate(parseInt(attributeValue.N, 10)),
  toDb: propertyValue => ({ N: `${propertyValue.UNIX}` }),
}
