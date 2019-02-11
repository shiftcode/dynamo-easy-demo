import { CollectionProperty, DateProperty, Model, PartitionKey } from '@shiftcoders/dynamo-easy'
import { FnsDate } from '../static/fns-date'

@Model({ tableName: 'employees' })
export class Employee {
  // unique by email
  @PartitionKey()
  email: string

  // unique by id as well, but not declared as such
  id: number

  // the name of the employee
  name: string

  // will be mapped to S(tring) through the Mapper provided in updateDynamoEasyConfig
  @DateProperty()
  employment: FnsDate

  @DateProperty()
  dateOfNotice?: FnsDate

  // will be mapped to S(tring)S(et)
  // and parsed to Set<string>
  skills?: Set<string>

  // will be mapped to L(ist) of S(trings) in dynamodb (to keep the order)
  // but marshalled as Set<string> from dynamo-easy
  @CollectionProperty({ sorted: true })
  achievements?: Set<string>

  tooLateInOfficeCounter = 0

  constructor(
    id: number,
    email: string,
    name: string,
    employment: FnsDate,
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
