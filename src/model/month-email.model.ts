import { FnsDate } from '../static/fns-date'

const SEPARATOR = '-'

export class MonthEmail {
  month: FnsDate
  email: string

  static parse(value: string): MonthEmail {
    const parts = value.split(SEPARATOR)
    if (parts.length !== 2) {
      throw new Error(`invalid input value: '${value}'`)
    }
    const month = FnsDate.fromYearMonth(parts[0])
    return new MonthEmail(month, parts[1])
  }

  static unparse({ month, email }: MonthEmail): string {
    return [month.YearMonth, email].join(SEPARATOR)
  }

  constructor(month: FnsDate, email: string) {
    this.month = month
    this.email = email
  }
}
