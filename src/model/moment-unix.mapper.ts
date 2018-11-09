import { MapperForType, NumberAttribute, PropertyMetadata } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'


/**
 * store moment dates as unix timestamp instead of string values
 */
export class MomentUnixMapper implements MapperForType<moment.Moment, NumberAttribute> {

  fromDb(attributeValue: NumberAttribute, propertyMetadata?: PropertyMetadata<moment.Moment>): moment.Moment {
    return moment.unix(parseInt(attributeValue.N, 10))
  }

  toDb(propertyValue: moment.Moment, propertyMetadata?: PropertyMetadata<moment.Moment>): NumberAttribute {
    return { N: `${propertyValue.unix()}` }
  }

}
