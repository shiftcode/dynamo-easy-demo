import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoStore, update2, UpdateExpressionDefinitionFunction } from '@shiftcoders/dynamo-easy'
import { Employee } from '../model/index.js'
import { FnsDate } from '../static/fns-date.js'

export class EmployeeService {
  readonly store: DynamoStore<Employee>

  constructor(dynamoDB: DynamoDB) {
    this.store = new DynamoStore<Employee>(Employee, dynamoDB)
  }

  ////////////
  // | READ |//
  ////////////

  /**
   * fetch all employees.
   */
  getAll(): Promise<Employee[]> {
    return this.store.scan().execFetchAll()
  }

  /**
   * get an employee by e-mail.
   * @param email
   */
  getByEmail(email: string) {
    return this.store
      .get(email) // direct access since there's only the email address as partition key
      .exec()
  }

  transactGetManyByEmail(...emailAddresses: string[]) {
    return this.store.transactGet(emailAddresses.map((email) => ({ email }))).exec()
  }

  /////////////
  // | WRITE |//
  /////////////

  terminateEmployment(employee: Employee, dateOfNotice: FnsDate = new FnsDate()): Promise<void> {
    return this.store.update(employee.email, employee.id).updateAttribute('dateOfNotice').set(dateOfNotice).exec()
  }

  addAchievements(employee: Employee, achievements: Set<string>): Promise<void> {
    const chain = update2(Employee, 'achievements')

    const operation = Array.isArray(employee.achievements) ? chain.appendToList(achievements) : chain.set(achievements)
    return this.update(employee, operation)
  }

  removeAchievement(employee: Employee, achievements: string[]): Promise<void> {
    if (!employee.achievements) {
      return Promise.reject('Employee does not contain any achievements')
    }

    // find the indexes from the given achievements
    const indexes = achievements
      .map((achievement) => Array.from(employee.achievements!).findIndex((a) => a === achievement))
      .filter((ix) => ix >= 0)

    if (indexes.length === 0) {
      return Promise.reject('')
    }

    return this.store
      .update(employee.email, employee.id)
      .updateAttribute('achievements')
      .removeFromListAt(...indexes)
      .exec()
  }

  addSkills(employee: Employee, skills: Set<string>): Promise<void> {
    const chain = update2(Employee, 'skills')
    const operation = !!employee.skills ? chain.add(skills) : chain.set(skills)
    return this.update(employee, operation)
  }

  removeSkills(employee: Employee, skills: string[] | Set<string>): Promise<void> {
    // when using set, you can remove items by their value
    return this.store.update(employee.email, employee.id).updateAttribute('skills').removeFromSet(skills).exec()
  }

  incrementTooLateInOfficeCounter(employee: Employee): Promise<void> {
    /**
     * with the incrementBy/decrementBy operation you can directly edit numbers without knowing them
     */
    const operation = update2(Employee, 'tooLateInOfficeCounter').incrementBy(1)
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
  }
}
