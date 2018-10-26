import { Model, PartitionKey, SortedSet, SortKey, TypedSet, Date, LSISortKey } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment'
import { DynamoIndexes } from '../static/dynamo-indexes'

@Model({ tableName: 'employees' })
export class Employee {

  // unique by email
  @PartitionKey()
  email: string

  // unique by id
  id: number

  name: string

  // will be mapped to S(tring)
  // date type either with configuration (annotation)
  @Date()
  employment: moment.Moment

  // or by convention
  dateOfNotice?: moment.Moment

  // make sure the values are marshalled as Set when reading from dynamoDb
  // will be mapped to S(tring)S(et)
  @TypedSet()
  skills?: Set<string>

  // will be mapped to S(tring)L(ist) in dynamodb
  // but marshalled as Set from dynamo-easy
  @SortedSet()
  achievements?: Set<String>

  tooLateInOfficeCounter: number = 0

  constructor(id: number, email: string, name: string, employment: moment.Moment, skills?:Set<string>, achievements?: Set<String>) {
    this.id = id
    this.email = email
    this.name = name
    this.employment = employment
    this.skills = skills
    this.achievements = achievements
  }
}