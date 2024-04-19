import { FnsDate } from './fns-date.js'

export const sum = (u: number, i: number) => u + i

export const createRandomDateFn = (from: FnsDate, to: FnsDate) => {
  const min = from.UNIX
  const factor = to.UNIX - min
  return () => new FnsDate(min + Math.floor(Math.random() * factor))
}

export const toCamelCase = (txt: string) =>
  txt
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (l) => `-${l}`)
    .split(/[-\s_.]/)
    .filter((i) => i !== '')
    .reduce((u, i, ix) => {
      return ix === 0 ? i.toLowerCase() : u + i.substring(0, 1).toUpperCase() + i.substring(1).toLowerCase()
    }, '')

export const leftPad = (txt: string | number | boolean, lngth: number, c?: string) => txt.toString().padStart(lngth, c)

export const rightPad = (txt: string | number | boolean, lngth: number, c?: string) => txt.toString().padEnd(lngth, c)
