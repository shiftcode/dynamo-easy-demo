import { MapperForType, StringAttribute } from '@shiftcoders/dynamo-easy'
import { FnsDate } from '../static/fns-date'

export const fnsDateIsoMapper: MapperForType<FnsDate, StringAttribute> = {
  fromDb: attribute => new FnsDate(attribute.S),
  toDb: value => ({ S: value.ISO }),
}
