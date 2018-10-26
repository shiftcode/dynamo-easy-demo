import { MapperForType, PropertyMetadata } from '@shiftcoders/dynamo-easy'
import { DynamoDB } from 'aws-sdk'
import { MonthEmail } from './month-email.model'


export class MonthEmailMapper implements MapperForType<MonthEmail> {

  fromDb(attributeValue: DynamoDB.AttributeValue, propertyMetadata?: PropertyMetadata<MonthEmail>): MonthEmail {
    return MonthEmail.parse(attributeValue.S!)
  }

  toDb(propertyValue: MonthEmail, propertyMetadata?: PropertyMetadata<MonthEmail>): DynamoDB.AttributeValue {
    return { S: `${MonthEmail.unparse(propertyValue)}` }
  }

}