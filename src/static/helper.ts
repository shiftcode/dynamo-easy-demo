import * as moment from 'moment'

export const sum = (u: number, i: number) => u + i


export const createRandomDateFn = (from: moment.Moment, to: moment.Moment) => {
  const min = from.clone().unix()
  const factor = to.clone().unix() - min
  return () => moment.unix(min + Math.floor(Math.random() * factor))
}