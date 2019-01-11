import * as moment from 'moment-timezone'

export const sum = (u: number, i: number) => u + i

export const createRandomDateFn = (from: moment.Moment, to: moment.Moment) => {
  const min = from.clone().unix()
  const factor = to.clone().unix() - min
  return () => moment.unix(min + Math.floor(Math.random() * factor))
}

export const toCamelCase = (txt: string) =>
  txt
    .replace(/(?:^\w|[A-Z]|\b\w)/g, l => `-${l}`)
    .split(/[-\s_.]/)
    .filter(i => i !== '')
    .reduce((u, i, ix) => {
      return ix === 0 ? i.toLowerCase() : u + i.substring(0, 1).toUpperCase() + i.substring(1).toLowerCase()
    }, '')

export const leftPad = (txt: string | number | boolean, lngth: number, c?: string) => txt.toString().padStart(lngth, c)

export const rightPad = (txt: string | number | boolean, lngth: number, c?: string) => txt.toString().padEnd(lngth, c)
