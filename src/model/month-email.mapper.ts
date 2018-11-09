import { MapperForType, PropertyMetadata, StringAttribute } from '@shiftcoders/dynamo-easy'
import { DynamoDB } from 'aws-sdk'
import { MonthEmail } from './month-email.model'

export class MonthEmailMapper implements MapperForType<MonthEmail, StringAttribute> {
  fromDb(attributeValue: StringAttribute, propertyMetadata?: PropertyMetadata<MonthEmail>): MonthEmail {
    return MonthEmail.parse(attributeValue.S!)
  }

  toDb(propertyValue: MonthEmail, propertyMetadata?: PropertyMetadata<MonthEmail>): StringAttribute {
    return { S: `${MonthEmail.unparse(propertyValue)}` }
  }
}
