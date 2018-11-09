import * as moment from 'moment-timezone'

export const sum = (u: number, i: number) => u + i

export const createRandomDateFn = (from: moment.Moment, to: moment.Moment) => {
  const min = from.clone().unix()
  const factor = to.clone().unix() - min
  return () => moment.unix(min + Math.floor(Math.random() * factor))
}

export const padStart = (txt: string | number | boolean, length: number, c?: string) =>
  <string>(<any>txt.toString()).padStart(length, c)

export const padEnd = (txt: string | number | boolean, length: number, c?: string) =>
  <string>(<any>txt.toString()).padEnd(length, c)
