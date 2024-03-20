import { FnsDate } from '../static/fns-date.js'
import { leftPad } from '../static/helper.js'

const MULTIPLIER_E = 10

export class TimeEntryId {
  date: FnsDate
  employeeId: number

  // JS number is not exact enough to handle numbers that big (but dynamoDb is)
  // so we do simple string operations to concat two numbers to one

  static parse(value: string): TimeEntryId {
    const employeeId = parseInt(value.substr(value.length - MULTIPLIER_E), 10)
    const date = new FnsDate(value.substr(0, value.length - MULTIPLIER_E))
    return new TimeEntryId(date, employeeId)
  }

  static unparse({ date, employeeId }: TimeEntryId): string {
    return `${date.UNIX}${leftPad(employeeId, MULTIPLIER_E, '0')}`
  }

  constructor(date: FnsDate, employeeId: number = 0) {
    this.date = date
    this.employeeId = employeeId
  }
}
