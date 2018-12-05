import * as moment from 'moment-timezone'

const FMT_YEAR_MONTH = 'YYYYMM'
const SEPARATOR = '-'

export class MonthEmail {
  month: moment.Moment
  email: string

  static parse(value: string): MonthEmail {
    const parts = value.split(SEPARATOR)
    if (parts.length !== 2) {
      throw new Error(`invalid input value: '${value}'`)
    }
    const month = moment(parts[0], FMT_YEAR_MONTH)
    if (!month.isValid()) {
      throw new Error(`invalid date part in input value: '${value}'`)
    }
    return new MonthEmail(month, parts[1])
  }

  static unparse({ month, email }: MonthEmail): string {
    return [month.format(FMT_YEAR_MONTH), email].join(SEPARATOR)
  }

  constructor(month: moment.Moment, email: string) {
    this.month = month
    this.email = email
  }
}
