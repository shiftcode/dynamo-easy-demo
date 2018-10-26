import * as moment from 'moment'
import { Employee, Project, TimeEntry } from './model'
import { createRandomDateFn, sum } from './static/helper'
import { EmployeeService, ProjectService, TimeEntryService } from './services'
import * as AWS from 'aws-sdk'
import { toPairs } from 'lodash'

let employeeService: EmployeeService
let projectService: ProjectService
let timeEntryService: TimeEntryService

function init() {
  const region = 'eu-central-1'
  /**
   * read access only.
   */
  const credentials = new AWS.Credentials('AKIAJDIFU27G54PP6XIA', 'XABP9l+KKrHug5AZXsYYoaz3SSsuXqOkLMPqO4iu')
  AWS.config.update({ region, credentials })

  employeeService = new EmployeeService()
  projectService = new ProjectService()
  timeEntryService = new TimeEntryService()
}

async function write() {
  console.debug('write entries')
  const employees: Array<Employee> = [
    new Employee(1, 'first.employee@shiftcode.ch', 'First Employee', moment('2018-01-01'), new Set(['hacking']), new Set(['first employee'])),
    new Employee(2, 'second.employee@shiftcode.ch', 'Second Employee', moment('2018-02-01'), new Set(['hacking']), new Set(['staying sober for one week'])),
    new Employee(3, 'third.employee@shiftcode.ch', 'Third Employee', moment('2018-02-01'), new Set(['sleeping']), new Set(['singing a song'])),
    new Employee(4, 'fourth.employee@shiftcode.ch', 'Fourth Employee', moment('2018-02-01'), new Set(['sleeping', 'hacking', 'table tennis'])),
    new Employee(5, 'fifth.employee@shiftcode.ch', 'Fifth Employee', moment('2018-04-04'), new Set(['eating marzipan']), new Set(['eating 500g marzipan in 10 minutes'])),
  ]
  await employeeService.writeMany(employees)

  const projects: Array<Project> = [
    new Project('Shiftcode GmbH', 'dynamo-easy', moment('2018-01-01')),
    new Project('Example Inc.', 'An Easy Project', moment('2018-01-01')),
    new Project('Shiftcode GmbH', 'dynamo-easy Demo', moment('2018-08-01')),
    new Project('Example Inc.', 'Other Project', moment('2018-03-01')),
  ]
  await projectService.writeMany(projects)

  const timeEntries = []
  for (const emp of employees) {
    for (const proj of projects) {
      const dateCreator = createRandomDateFn(emp.employment.isAfter(proj.creationDate) ? emp.employment : proj.creationDate, moment('2018-10-31'))
      const t = Math.random() * 10
      for (let i = 0; i < t; i++) {
        timeEntries.push(TimeEntry.fromObjects(proj, emp, dateCreator(), Math.floor(Math.random() * 8 * 60 * 60)))
      }
    }
  }
  await timeEntryService.writeMany(timeEntries)
}

async function read() {
  console.debug('fetch employees and projects')
  const [employees, projects] = await Promise.all([employeeService.getAll(), projectService.getAll()])

  console.debug('\nEmployees first month')
  for (const employee of employees) {
    const monthToFetch = employee.employment
    const timeEntriesFirstMonth = await timeEntryService.getByEmployeeAndMonth(employee, monthToFetch)
    const seconds = timeEntriesFirstMonth.map(t => t.duration).reduce(sum, 0)
    console.debug(
      `- Employee '${employee.name}' worked ${seconds} seconds in ${monthToFetch.format('MMMM YYYY')}.`
    )
  }

  console.debug('\nProject Time Report')
  for (const project of projects) {
    const fromTo = [
      project.creationDate,
      moment().endOf('month')
    ]
    const timeEntries = await timeEntryService.getByProject(project, fromTo[0], fromTo[1])
    const seconds = timeEntries.map(t => t.duration).reduce(sum, 0)
    const [from, to] = fromTo.map(m => m.format('l'))
    console.debug(
      `- Project '${project.name} | ${project.client}' absorbed ${seconds} seconds from ${from} till ${to}`
    )
  }

  const emp: Employee | null = await employeeService.getByEmail('first.employee@shiftcode.ch')

  console.debug(`\n`)
  if (!!emp) {
    toPairs(emp).forEach(([key, val]) => {
      if (val instanceof Set) {
        console.debug(`${key} (${val.constructor.name}):  ${Array.from(val).join(' | ')}`)
      } else {
        console.debug(`${key} (${val.constructor.name}):  ${val}`)
      }
    })

  }

}

init()
// write().then(() => console.debug('\n\nDONE'))
read().then(() => console.debug('\n\nDONE'))