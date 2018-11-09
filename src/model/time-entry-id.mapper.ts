import { MapperForType, NumberAttribute, PropertyMetadata } from '@shiftcoders/dynamo-easy'
import { DynamoDB } from 'aws-sdk'
import { TimeEntryId } from './time-entry-id.model'

export class TimeEntryIdMapper implements MapperForType<TimeEntryId, NumberAttribute> {
  fromDb(attributeValue: DynamoDB.AttributeValue, propertyMetadata?: PropertyMetadata<TimeEntryId>): TimeEntryId {
    return TimeEntryId.parse(attributeValue.N!)
  }

  toDb(propertyValue: TimeEntryId, propertyMetadata?: PropertyMetadata<TimeEntryId>): NumberAttribute {
    return { N: `${TimeEntryId.unparse(propertyValue)}` }
  }
}
