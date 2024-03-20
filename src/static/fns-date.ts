import { addSeconds, endOfMonth, format, fromUnixTime, parse } from 'date-fns'

const FMT_YEAR_MONTH = 'YYYYMM'

/**
 * Immutable Date Object with helper functions
 */
export class FnsDate {
  get YearMonth(): number {
    return parseInt(format(this.date, FMT_YEAR_MONTH), 10)
  }

  get ISO(): string {
    return this.date.toISOString()
  }

  get UNIX(): number {
    return this.date.getTime()
  }

  readonly date: Date

  static fromYearMonth(yearmonth: number | string): FnsDate {
    const m = /^(\d{4})(\d{2})$/.exec(yearmonth.toString())
    if (m && m.length === 3) {
      return new FnsDate(`${m[1]}-${m[2]}-01`)
    }
    throw new Error('given number is not a year-month number')
  }

  constructor(date?: Date | string | number) {
    if (!date) {
      this.date = new Date()
    } else if (date instanceof Date) {
      this.date = date
    } else if (typeof date === 'number') {
      this.date = fromUnixTime(date)
    } else {
      this.date = parse(date, 'yyyy-MM-dd', new Date())
    }
  }

  addSeconds(secondsToAdd: number): FnsDate {
    return new FnsDate(addSeconds(this.date, secondsToAdd))
  }

  endOfMonth(): FnsDate {
    return new FnsDate(endOfMonth(this.date))
  }

  isAfter(creationDate: FnsDate): boolean {
    return this.UNIX > creationDate.UNIX
  }

  format(fmt: string): string {
    return format(this.date, fmt)
  }

  toString(): string {
    return this.date.toISOString()
  }
}
