import * as moment from 'moment-timezone'

const MULTIPLIER_E = 10

export class TimeEntryId {
  date: moment.Moment
  employeeId: number

  // JS number is not exact enough to handle numbers that big (but dynamoDb is)
  // so we do simple string operations to concat two numbers to one

  static parse(value: string): TimeEntryId {
    const employeeId = parseInt(value.substr(value.length - MULTIPLIER_E), 10)
    const unixTs = parseInt(value.substr(0, value.length - MULTIPLIER_E), 10)
    return new TimeEntryId(moment.unix(unixTs), employeeId)
  }

  static unparse({ date, employeeId }: TimeEntryId): string {
    return date.unix().toString() + (<any>employeeId.toString()).padStart(MULTIPLIER_E, '0')
  }

  constructor(date: moment.Moment, employeeId: number = 0) {
    this.date = date
    this.employeeId = employeeId
  }
}
