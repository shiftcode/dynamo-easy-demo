import { MapperForType, StringAttribute } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'

export const momentIso8601Mapper: MapperForType<moment.Moment, StringAttribute> = {
  fromDb: attribute => moment(attribute.S, moment.ISO_8601),
  toDb: value => ({
    S: value
      .clone()
      .utc()
      .format(),
  }),
}
