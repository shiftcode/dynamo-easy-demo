import {
  CustomMapper,
  GSIPartitionKey,
  GSISortKey,
  Model,
  PartitionKey,
  SortKey,
  Transient
} from '@shiftcoders/dynamo-easy'
import * as moment from 'moment'
import { ClientProjectMapper } from './client-project.mapper'
import { ClientProject } from './client-project.model'
import { MonthEmailMapper } from './month-email.mapper'
import { MonthEmail } from './month-email.model'
import { Project } from './project.model'
import { TimeEntryId } from './time-entry-id.model'
import { TimeEntryIdMapper } from './time-entry-id.mapper'
import { DynamoIndexes } from '../static/dynamo-indexes'
import { Employee } from './employee.model'

// unique by monthEmail + startDate or clientProject + unixTsUserId
// means an employee can only have one time entry at a starting time
@Model({ tableName: 'timeEntries' })
export class TimeEntry {

  // if you want a complex type as PartitionKey or SortKey
  // you need to define a custom mapper since dynamoDb only accepts string, number or binary for such
  @CustomMapper(MonthEmailMapper)
  @PartitionKey()
  monthEmail: MonthEmail

  @SortKey()
  startDate: moment.Moment

  @CustomMapper(ClientProjectMapper)
  @GSIPartitionKey(DynamoIndexes.TIME_ENTRIES_CLIENTPROJECT_UNIXTSUSERID)
  clientProject: ClientProject

  // this sort key is composed of the unix timestamp and the user id.
  // it's used to read all time entries in a specific time from a project
  @CustomMapper(TimeEntryIdMapper)
  @GSISortKey(DynamoIndexes.TIME_ENTRIES_CLIENTPROJECT_UNIXTSUSERID)
  unixTsUserId: TimeEntryId

  duration: number // seconds


  // if you have properties or getters, which should not be stored in the table
  // you have to decorate them with @Transient()
  // --> blacklist
  @Transient()
  get uniqueIdentifier() {
    return `${this.monthEmail}${this.startDate.toISOString()}`
  }

  constructor(
    clientSlug: string,
    projectSlug: string,
    startDate: moment.Moment,
    duration: number,
    userId: number,
    userEmail: string
  ) {
    this.monthEmail = new MonthEmail(startDate, userEmail)
    this.startDate = startDate
    this.clientProject = new ClientProject(clientSlug, projectSlug)
    this.unixTsUserId = new TimeEntryId(startDate, userId)
    this.duration = duration
  }

  static fromObjects({ clientSlug, slug }: Project, { id, email }: Employee, startDate: moment.Moment, duration: number) {
    return new TimeEntry(clientSlug, slug, startDate, duration, id, email)
  }
}
