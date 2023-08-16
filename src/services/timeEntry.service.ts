import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoStore } from '@shiftcoders/dynamo-easy'
import { Employee, Project, TimeEntry, TimeEntryId } from '../model'
import { ClientProject } from '../model/client-project.model'
import { MonthEmail } from '../model/month-email.model'
import { DynamoIndexes } from '../static/dynamo-indexes'
import { FnsDate } from '../static/fns-date'

export class TimeEntryService {
  readonly store: DynamoStore<TimeEntry>

  constructor(dynamoDB: DynamoDB) {
    this.store = new DynamoStore<TimeEntry>(TimeEntry, dynamoDB)
  }

  ////////////
  // | READ |//
  ////////////

  /**
   * fetch all timeEntries from an employee in a specific month.
   */
  getByEmployeeAndMonth(employee: Employee, month: FnsDate): Promise<TimeEntry[]> {
    return this.store
      .query()
      .wherePartitionKey(new MonthEmail(month, employee.email)) // get all from this partition
      .execFetchAll()
  }

  /**
   * get all time entries in a specific time frame from a project.
   * uses an global secondary index
   */
  getByProject(project: Project, from: FnsDate, to: FnsDate): Promise<TimeEntry[]> {
    return this.store
      .query()
      .index(DynamoIndexes.TIME_ENTRIES_CLIENTPROJECT_UNIXTSUSERID)
      .wherePartitionKey(new ClientProject(project.clientSlug, project.slug))
      .whereSortKey()
      .between(new TimeEntryId(from), new TimeEntryId(to.addSeconds(1)))
      .execFetchAll()
  }

  /////////////
  // | WRITE |//
  /////////////

  deleteMonthEntriesByEmployee(employee: Employee, month: FnsDate): Promise<void> {
    return this.store.delete(new MonthEmail(month, employee.email)).exec()
  }

  writeSingle(entry: TimeEntry): Promise<void> {
    return this.store.put(entry).exec()
  }

  writeMany(entries: TimeEntry[]): Promise<void> {
    // write many (up to 25) of same table in one request with store.batchWrite
    return this.store
      .batchWrite()
      .put(entries) // you can also combine a put and delete request.
      .exec()
  }

  deleteMany(entries: TimeEntry[]): Promise<void> {
    return this.store.batchWrite().delete(entries).exec()
  }
}
