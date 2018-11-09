import { CustomMapper, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy'
import { camelCase } from 'lodash'
import * as moment from 'moment-timezone'
import { MomentUnixMapper } from './moment-unix.mapper'

@Model({ tableName: 'projects' })
export class Project {
  @PartitionKey()
  clientSlug: string

  @SortKey()
  slug: string

  client: string
  name: string

  @CustomMapper(MomentUnixMapper)
  creationDate: moment.Moment

  constructor(client: string, name: string, creationDate: moment.Moment = moment()) {
    this.clientSlug = camelCase(client)
    this.slug = camelCase(name)
    this.client = client
    this.name = name
    this.creationDate = creationDate
  }
}
