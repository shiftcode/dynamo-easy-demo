import { MapperForType, NumberAttribute } from '@shiftcoders/dynamo-easy'
import { TimeEntryId } from './time-entry-id.model.js'

export const timeEntryIdMapper: MapperForType<TimeEntryId, NumberAttribute> = {
  fromDb: (attributeValue) => TimeEntryId.parse(attributeValue.N),
  toDb: (propertyValue) => ({ N: `${TimeEntryId.unparse(propertyValue)}` }),
}
