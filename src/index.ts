import * as AWS from 'aws-sdk'
import { toPairs } from 'lodash'
import * as moment from 'moment-timezone'
import { Employee, Project, TimeEntry } from './model'
import { EmployeeService, ProjectService, TimeEntryService } from './services'
import { createRandomDateFn, padEnd, padStart, sum } from './static/helper'

let employeeService: EmployeeService
let projectService: ProjectService
let timeEntryService: TimeEntryService

// set global timezone for moment
moment.tz.setDefault('Etc/UTC')

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
  const employees: Employee[] = [
    new Employee(1, 'first.employee@shiftcode.ch', 'First Employee', moment('2018-01-01'), new Set(['hacking']), new Set(['first employee'])),
    new Employee(2, 'second.employee@shiftcode.ch', 'Second Employee', moment('2018-02-01'), new Set(['hacking']), new Set(['staying sober for one week'])),
    new Employee(3, 'third.employee@shiftcode.ch', 'Third Employee', moment('2018-02-01'), new Set(['sleeping']), new Set(['singing a song'])),
    new Employee(4, 'fourth.employee@shiftcode.ch', 'Fourth Employee', moment('2018-02-01'), new Set(['sleeping', 'hacking', 'table tennis'])),
    new Employee(5, 'fifth.employee@shiftcode.ch', 'Fifth Employee', moment('2018-04-04'), new Set(['eating marzipan']), new Set(['eating 500g marzipan in 10 minutes'])),
    new Employee(6, 'sixth.employee@shiftcode.ch', 'Sixth Employee', moment('2018-08-01'), new Set(['drinking coffee']), new Set(['sixth employee']))
  ]
  await employeeService.writeMany(employees)

  const projects: Project[] = [
    new Project('Shiftcode GmbH', 'dynamo-easy', moment('2018-01-01')),
    new Project('Example Inc.', 'An Easy Project', moment('2018-02-01')),
    new Project('Example Inc.', 'Other Project', moment('2018-04-01')),
    new Project('Shiftcode GmbH', 'dynamo-easy Demo', moment('2018-08-01')),
  ]
  await projectService.writeMany(projects)

  const timeEntries = []
  for (const emp of employees) {
    for (const proj of projects) {
      const dateCreator = createRandomDateFn(
        emp.employment.isAfter(proj.creationDate) ? emp.employment : proj.creationDate,
        moment('2018-08-31')
      )
      const t = Math.random() * 10
      for (let i = 0; i < t; i++) {
        timeEntries.push(TimeEntry.fromObjects(proj, emp, dateCreator(), Math.floor(Math.random() * 8 * 60 * 60)))
      }
    }
    for (let r = Math.random() * 10; r > 0; r--) {
      await employeeService.incrementTooLateInOfficeCounter(emp)
    }
  }
  await timeEntryService.writeMany(timeEntries)

  await employeeService.terminateEmployment(employees[5], moment('2018-08-31'))
  await employeeService.removeAchievement(employees[5], ['sixth employee'])
  await employeeService.removeSkills(employees[5], <Set<string>>employees[5].skills)
  await employeeService.addAchievements(employees[5], new Set(['getting fired']))
  await employeeService.addSkills(employees[0], new Set(['firing DAUs']))
}

async function read() {
  {
    console.debug('\nemployees first month')

    const employees = await employeeService.getAll()

    for (const employee of employees) {
      const monthToFetch = employee.employment

      const timeEntriesFirstMonth = await timeEntryService.getByEmployeeAndMonth(employee, monthToFetch)

      const seconds = timeEntriesFirstMonth.map(t => t.duration).reduce(sum, 0)
      console.debug(
        `- ${padEnd(employee.name, 20)
          } worked ${padStart(seconds, 7)
          } seconds in ${padStart(monthToFetch.format('MMMM YYYY'), 20)
          }.`
      )
    }
  }

  {
    console.debug(`\nthe first Employee`)
    const emp: Employee | null = await employeeService.getByEmail('first.employee@shiftcode.ch')
    toPairs(emp || {})
      .forEach(([key, val]) => {
        console.debug(`  ${padEnd(key, 25)}  (${padEnd(val.constructor.name + ')', 10)} ${val instanceof Set ? Array.from(val).join(' | ') : val}`)
      })

  }

  {
    console.debug(`\nprojects started in spring`)
    const projectsStartedInSpring = await projectService.getByCreationDate(moment('2018-03-20'), moment('2018-06-21'))
    for (const proj of projectsStartedInSpring) {
      console.debug(`- '${proj.name}' from ${proj.client} started on ${proj.creationDate.format('l')}`)
    }
  }

  {
    console.debug('\nprojects from shiftcode')
    const projectsFromShiftcode = await projectService.getAllByClient('shiftcodeGmbH')
    for (const proj of projectsFromShiftcode) {
      console.debug(`- ${proj.name} (${proj.slug}) ${proj.creationDate}`)
    }
  }

  {
    console.debug('\nproject time reports')

    const projects = await projectService.getAll()

    for (const project of projects) {
      const fromTo: [moment.Moment, moment.Moment] = [project.creationDate, moment().endOf('month')]
      const timeEntries = await timeEntryService.getByProject(project, ...fromTo)
      const seconds = timeEntries.map(t => t.duration).reduce(sum, 0)
      const [from, to] = fromTo.map(m => m.format('l'))
      console.debug(
        `- ${padEnd(project.name, 20)}  ${padEnd(project.client, 15)}: ${padStart(seconds, 10)} seconds | ${from} - ${to}`
      )
    }
  }
}

init()
// write().then(() => console.debug('\n\nDONE'))
read().then(() => console.debug('\n\nDONE'))