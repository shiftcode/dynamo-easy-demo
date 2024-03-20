import { MapperForType, StringAttribute } from '@shiftcoders/dynamo-easy'
import { MonthEmail } from './month-email.model.js'

export const monthEmailMapper: MapperForType<MonthEmail, StringAttribute> = {
  fromDb: (attributeValue) => MonthEmail.parse(attributeValue.S),
  toDb: (propertyValue) => ({ S: `${MonthEmail.unparse(propertyValue)}` }),
}
