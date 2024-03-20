import { Model, PartitionKey, Property, SortKey } from '@shiftcoders/dynamo-easy'
import { FnsDate } from '../static/fns-date.js'
import { toCamelCase } from '../static/helper.js'
import { fnsDateUnixMapper } from './fns-date-unix.mapper.js'

@Model({ tableName: 'projects' })
export class Project {
  @PartitionKey()
  clientSlug: string

  @SortKey()
  slug: string

  client: string
  name: string

  @Property({ mapper: fnsDateUnixMapper })
  creationDate: FnsDate

  constructor(client: string, name: string, creationDate: FnsDate = new FnsDate()) {
    this.clientSlug = toCamelCase(client)
    this.slug = toCamelCase(name)
    this.client = client
    this.name = name
    this.creationDate = creationDate
  }
}
