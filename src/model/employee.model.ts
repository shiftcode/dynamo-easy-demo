import { DateProperty, Model, PartitionKey, SortedSet, TypedSet } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'

@Model({ tableName: 'employees' })
export class Employee {
  // unique by email
  @PartitionKey()
  email: string

  // unique by id
  id: number

  name: string

  // will be mapped to S(tring)
  @DateProperty()
  employment: moment.Moment

  @DateProperty() // date by name convention is no longer supported
  dateOfNotice?: moment.Moment

  // make sure the values are marshalled as Set when reading from dynamoDb
  // will be mapped to S(tring)S(et)
  @TypedSet()
  skills?: Set<string>

  // will be mapped to S(tring)L(ist) in dynamodb
  // but marshalled as Set from dynamo-easy
  @SortedSet()
  achievements?: Set<string>

  tooLateInOfficeCounter = 0

  constructor(
    id: number,
    email: string,
    name: string,
    employment: moment.Moment,
    skills?: Set<string>,
    achievements?: Set<string>
  ) {
    this.id = id
    this.email = email
    this.name = name
    this.employment = employment
    this.skills = skills
    this.achievements = achievements
  }
}
