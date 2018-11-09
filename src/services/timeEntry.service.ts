import { DynamoStore } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'
import { Employee, Project, TimeEntry, TimeEntryId } from '../model'
import { ClientProject } from '../model/client-project.model'
import { MonthEmail } from '../model/month-email.model'
import { DynamoIndexes } from '../static/dynamo-indexes'

export class TimeEntryService {
  private store = new DynamoStore<TimeEntry>(TimeEntry)

  ////////////
  // | READ |//
  ////////////

  /**
   * fetch all timeEntries from an employee in a specific month.
   * @param employee {Employee}
   * @param month {Moment}
   */
  getByEmployeeAndMonth(employee: Employee, month: moment.Moment): Promise<TimeEntry[]> {
    return this.store
      .query()
      .wherePartitionKey(new MonthEmail(month, employee.email)) // get all from this partition
      .execFetchAll()
      .toPromise()
  }

  /**
   * get all time entries in a specific time frame from a project.
   * uses an global secondary index
   */
  getByProject(project: Project, from: moment.Moment, to: moment.Moment): Promise<TimeEntry[]> {
    return this.store
      .query()
      .index(DynamoIndexes.TIME_ENTRIES_CLIENTPROJECT_UNIXTSUSERID)
      .wherePartitionKey(new ClientProject(project.clientSlug, project.slug))
      .whereSortKey()
      .between(new TimeEntryId(from), new TimeEntryId(moment(to).add(1, 'second')))
      .execFetchAll()
      .toPromise()
  }

  /////////////
  // | WRITE |//
  /////////////

  deleteMonthEntriesByEmployee(employee: Employee, month: moment.Moment): Promise<void> {
    return this.store
      .delete(new MonthEmail(month, employee.email))
      .exec()
      .toPromise()
  }

  writeSingle(entry: TimeEntry): Promise<void> {
    return this.store
      .put(entry)
      .exec()
      .toPromise()
  }

  writeMany(entries: TimeEntry[]): Promise<void> {
    return this.store
      .batchWrite()
      .put(entries) // you can also combine a put and delete request.
      .exec()
      .toPromise()
  }

  deleteMany(entries: TimeEntry[]): Promise<void> {
    return this.store
      .batchWrite()
      .delete(entries)
      .exec()
      .toPromise()
  }
}
