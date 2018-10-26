import { DynamoStore } from '@shiftcoders/dynamo-easy'
import { Project, TimeEntry } from '../model'

export class ProjectService {
  private store = new DynamoStore<Project>(Project)

  ////////////
  //| READ |//
  ////////////

  /**
   * fetch all projects.
   */
  getAll(): Promise<Project[]> {
    // when reading ALL items from a table you need scan
    return this.store
      .scan()
      //.exec() // --> exec would return the first page of items
      .execFetchAll()  // --> instead using execFetchAll to fetch the items of all pages (multiple requests)
      .toPromise()
  }


  /**
   * fetch projects from a specific client
   * @param client {string}
   */
  getAllByClient(client: string): Promise<Project[]> {
    // when filtering a property which is no a HASH or SORT key, you need scan as well.
    return this.store
      .scan()
      .whereAttribute('client').eq(client)
      .execFetchAll()
      .toPromise()
  }

  /////////////
  //| WRITE |//
  /////////////

  writeMany(projects: Project[]): Promise<void> {
    return this.store
      .batchWrite()
      .put(projects)    // you can also combine a put and delete request.
      .exec()
      .toPromise()
  }

}
