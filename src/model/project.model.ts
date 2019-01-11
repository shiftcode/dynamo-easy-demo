import { CustomMapper, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'
import { toCamelCase } from '../static/helper'
import { momentUnixMapper } from './moment-unix.mapper'

@Model({ tableName: 'projects' })
export class Project {
  @PartitionKey()
  clientSlug: string

  @SortKey()
  slug: string

  client: string
  name: string

  @CustomMapper(momentUnixMapper)
  creationDate: moment.Moment

  constructor(client: string, name: string, creationDate: moment.Moment = moment()) {
    this.clientSlug = toCamelCase(client)
    this.slug = toCamelCase(name)
    this.client = client
    this.name = name
    this.creationDate = creationDate
  }
}
