import { DynamoStore, update } from '@shiftcoders/dynamo-easy'
import { UpdateExpressionDefinitionFunction } from '@shiftcoders/dynamo-easy/dist/_types/dynamo/expression/type/update-expression-definition-function'
import * as moment from 'moment'
import { Employee, TimeEntry } from '../model'
import { DynamoIndexes } from '../static/dynamo-indexes'

export class EmployeeService {
  private store = new DynamoStore<Employee>(Employee)

  ////////////
  //| READ |//
  ////////////

  getAll(): Promise<Employee[]> {
    return this.store.scan()
      .execFetchAll()
      .toPromise()
  }

  getByEmail(email: string) {
    return this.store.query()
      .wherePartitionKey(email)
      .execSingle()
      .toPromise()
  }


  /////////////
  //| WRITE |//
  /////////////

  writeMany(employees: Employee[]): Promise<void> {
    return this.store
      .batchWrite()
      .put(employees) // you can also combine a put and delete request.
      .exec()
      .toPromise()
  }

  terminateEmployment(employee: Employee, dateOfNotice: moment.Moment = moment()): Promise<void> {
    return this.update(employee, update<Employee>('dateOfNotice').set(dateOfNotice))
  }

  addAchievements(employee: Employee, achievements: string[]): Promise<void> {
    const chain = update<Employee>('achievements')

    const operation = Array.isArray(employee.achievements)
      ? chain.appendToList(achievements)
      : chain.set(achievements)
    return this.update(employee, operation)
  }

  removeAchievement(employee: Employee, achievements: string[]): Promise<void> {
    if (!employee.achievements) { return Promise.reject('Employee does not contain any achievements') }

    // find the indexes from the given achievements
    const indexes = achievements
      .map(achievement => Array.from(employee.achievements!).findIndex(a => a == achievement))
      .filter(ix => ix >= 0)

    if (indexes.length === 0) { return Promise.reject('') }

    const operation = update<Employee>('achievements').removeFromListAt(...indexes)
    return this.update(employee, operation)
  }

  addSkills(employee: Employee, skills: string[] | Set<string>): Promise<void> {
    const chain = update<Employee>('skills')
    const operation = !!employee.skills
      ? chain.add(skills)
      : chain.set(skills)
    return this.update(employee, operation)
  }

  removeSkills(employee: Employee, skills: string[] | Set<string>): Promise<void> {
    // when using set, you can remove items by their value
    const operation = update<Employee>('skills').removeFromSet(skills)
    return this.update(employee, operation)
  }

  incrementTooLateInOfficeCounter(employee: Employee): Promise<void> {
    /**
     * with the incrementBy/decrementBy operation you can directly edit numbers without knowing them
     */
    const operation = update<Employee>('tooLateInOfficeCounter').incrementBy(1)
    return this.update(employee, operation)
  }

  /**
   * helper method to reuse some code..
   * @param employee
   * @param operations
   */
  private update(employee: Employee, ...operations: UpdateExpressionDefinitionFunction[]): Promise<void> {
    return this.store
      .update(employee.email, employee.id)
      .operations(...operations)
      .exec()
      .toPromise()
  }
}