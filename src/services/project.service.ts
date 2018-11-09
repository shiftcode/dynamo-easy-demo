import { DynamoStore } from '@shiftcoders/dynamo-easy'
import * as moment from 'moment-timezone'
import { Project } from '../model'

export class ProjectService {
  private store = new DynamoStore<Project>(Project)

  ////////////
  // | READ |//
  ////////////

  /**
   * fetch all projects.
   */
  getAll(): Promise<Project[]> {
    // when reading ALL items from a table you need scan
    return this.store
      .scan()
      // .exec() // --> exec would return the first page of items
      .execFetchAll()  // --> instead using execFetchAll to fetch the items of all pages (multiple requests)
      .toPromise()
  }

  /**
   * fetch projects created in the given time range.
   * @param from
   * @param to
   */
  getByCreationDate(from: moment.Moment, to: moment.Moment): Promise<Project[]> {
    // when filtering a property which is neither HASH nor SORT key, you need scan as well.
    return this.store
      .scan()
      .whereAttribute('creationDate').between(from, to)
      .execFetchAll()
      .toPromise()
  }

  /**
   * fetch projects from a specific client.
   * @param clientSlug {string}
   */
  getAllByClient(clientSlug: string): Promise<Project[]> {
    return this.store
      .query()
      .wherePartitionKey(clientSlug) // get all from this partition
      .execFetchAll()
      .toPromise()
  }


  /////////////
  // | WRITE |//
  /////////////

  writeMany(projects: Project[]): Promise<void> {
    return this.store
      .batchWrite()
      .put(projects)    // you could also combine a put and delete request.
      .exec()
      .toPromise()
  }

}
