import {
  BatchWriteRequest,
  LogLevel,
  TransactConditionCheck,
  TransactUpdate,
  TransactWriteRequest,
  updateDynamoEasyConfig,
} from '@shiftcoders/dynamo-easy'
import 'reflect-metadata' // needs to be imported before any models are used
import { Employee, Project, TimeEntry } from './model'
import { fnsDateIsoMapper } from './model/fns-date-iso.mapper'
import { EmployeeService, ProjectService, TimeEntryService } from './services'
import { AnonymousAuthService } from './services/anonymous-auth.service'
import { FnsDate } from './static/fns-date'
import { createRandomDateFn, leftPad, rightPad, sum } from './static/helper'
import { createLogReceiver } from './static/my-log-receiver.function'
import { print } from './static/print.function'
import { dynamoEasyDemoTableNameResolver } from './static/table-name-resolver.function'

updateDynamoEasyConfig({
  // used to extend the table names with the stack name
  tableNameResolver: dynamoEasyDemoTableNameResolver,
  // used to define the mapper for all @DateProperty decorated fields
  dateMapper: fnsDateIsoMapper,
  // used to receive all log statements from dynamo-easy
  logReceiver: createLogReceiver(LogLevel.INFO),
})

async function write() {
  const employeeService = new EmployeeService()
  const timeEntryService = new TimeEntryService()

  print('write employees and projects')

  const employees: Employee[] = [
    new Employee(
      1,
      'first.employee@shiftcode.ch',
      'First Employee',
      new FnsDate('2018-01-01'),
      new Set(['hacking']),
      new Set(['first employee'])
    ),
    new Employee(
      2,
      'second.employee@shiftcode.ch',
      'Second Employee',
      new FnsDate('2018-02-01'),
      new Set(['hacking']),
      new Set(['staying sober for one week'])
    ),
    new Employee(
      3,
      'third.employee@shiftcode.ch',
      'Third Employee',
      new FnsDate('2018-02-01'),
      new Set(['sleeping']),
      new Set(['singing a song'])
    ),
    new Employee(
      4,
      'fourth.employee@shiftcode.ch',
      'Fourth Employee',
      new FnsDate('2018-02-01'),
      new Set(['sleeping', 'hacking', 'table tennis'])
    ),
    new Employee(
      5,
      'fifth.employee@shiftcode.ch',
      'Fifth Employee',
      new FnsDate('2018-04-04'),
      new Set(['eating marzipan']),
      new Set(['eating 500g marzipan in 10 minutes'])
    ),
    new Employee(
      6,
      'sixth.employee@shiftcode.ch',
      'Sixth Employee',
      new FnsDate('2018-08-01'),
      new Set(['drinking coffee']),
      new Set(['sixth employee'])
    ),
  ]
  const projects: Project[] = [
    new Project('Shiftcode GmbH', 'dynamo-easy', new FnsDate('2018-01-01')),
    new Project('Example Inc.', 'An Easy Project', new FnsDate('2018-02-01')),
    new Project('Example Inc.', 'Other Project', new FnsDate('2018-04-01')),
    new Project('Shiftcode GmbH', 'dynamo-easy Demo', new FnsDate('2018-08-01')),
  ]

  // write many (up to 25) items of different tables in one call with the BatchWriteRequest
  await new BatchWriteRequest()
    .put(Project, projects)
    .put(Employee, employees)
    .exec()

  print('write time entries')
  const timeEntries = []
  for (const emp of employees) {
    for (const pro of projects) {
      // randomly create some time entries per employee and project
      const dateCreator = createRandomDateFn(
        emp.employment.isAfter(pro.creationDate) ? emp.employment : pro.creationDate,
        new FnsDate('2018-08-31')
      )
      const t = Math.random() * 10
      for (let i = 0; i < t; i++) {
        timeEntries.push(TimeEntry.fromObjects(pro, emp, dateCreator(), Math.floor(Math.random() * 8 * 60 * 60)))
      }
    }
    // randomly set the tooLateInOfficeCounter
    for (let r = Math.random() * 10; r > 0; r--) {
      await employeeService.incrementTooLateInOfficeCounter(emp)
    }
  }
  while (timeEntries.length > 0) {
    await timeEntryService.writeMany(timeEntries.splice(0, 25))
  }

  // IF THE FIRST EMPLOYEE IS ABLE TO HACK && THE SECOND EMPLOYEE WAS NOT FIRED YET,
  // --> ADD JUMPING AS A SKILL TO THE SECOND EMPLOYEE
  await new TransactWriteRequest()
    .transact(
      new TransactConditionCheck(Employee, 'first.employee@shiftcode.ch').onlyIfAttribute('skills').contains('hacking'),
      new TransactUpdate(Employee, 'second.employee@shiftcode.ch')
        .updateAttribute('skills')
        .add(['jumping'])
        .onlyIfAttribute('dateOfNotice')
        .null()
    )
    .exec()

  print('fire the sixth employee')
  const emp5 = employees[5]

  await Promise.all([
    employeeService.terminateEmployment(emp5, new FnsDate('2018-08-31')),
    employeeService.removeAchievement(emp5, ['sixth employee']),
    employeeService.removeSkills(emp5, <Set<string>>emp5.skills),
    employeeService.addAchievements(emp5, new Set(['getting fired'])),
    employeeService.addSkills(employees[0], new Set(['firing DAUs'])),
  ])
}

async function read() {
  // set aws config before instantiating DynamoStore
  // (which itself creates DynamoDB instance from AWS which needs the config)
  updateDynamoEasyConfig({
    // used to make sure the aws credentials are set and valid before making a call to dynamoDb
    sessionValidityEnsurer: new AnonymousAuthService().sessionValidityEnsurer,
  })

  const employeeService = new EmployeeService()
  const projectService = new ProjectService()
  const timeEntryService = new TimeEntryService()

  {
    print('\nemployees first month')

    const employees = await employeeService.getAll()

    for (const employee of employees) {
      const monthToFetch = employee.employment

      const timeEntriesFirstMonth = await timeEntryService.getByEmployeeAndMonth(employee, monthToFetch)

      const seconds = timeEntriesFirstMonth.map(t => t.duration).reduce(sum, 0)
      print(
        `- ${rightPad(employee.name, 20)} worked ${leftPad(seconds, 7)} seconds in ${leftPad(
          monthToFetch.format('MMMM YYYY'),
          20
        )}.`
      )
    }
  }

  {
    print(`\nthe first Employee`)
    const emp: Employee | null = await employeeService.getByEmail('first.employee@shiftcode.ch')
    Object.entries(emp || {}).forEach(([key, val]) => {
      print(
        `  ${rightPad(key, 25)}  (${rightPad(val.constructor.name + ')', 10)} ${
          val instanceof Set ? Array.from(val).join(' | ') : val
        }`
      )
    })
  }

  {
    print(`\nprojects started in spring`)
    const projectsStartedInSpring = await projectService.getByCreationDate(
      new FnsDate('2018-03-20'),
      new FnsDate('2018-06-21')
    )
    for (const proj of projectsStartedInSpring) {
      print(`- '${proj.name}' from ${proj.client} started on ${proj.creationDate.format('l')}`)
    }
  }

  {
    print('\nprojects from shiftcode')
    const projectsFromShiftcode = await projectService.getAllByClient('shiftcodeGmbH')
    for (const proj of projectsFromShiftcode) {
      print(`- ${proj.name} (${proj.slug}) ${proj.creationDate}`)
    }
  }

  {
    print('\nproject time reports')

    const projects = await projectService.getAll()

    for (const project of projects) {
      const fromTo: [FnsDate, FnsDate] = [project.creationDate, new FnsDate().endOfMonth()]
      const timeEntries = await timeEntryService.getByProject(project, ...fromTo)
      const seconds = timeEntries.map(t => t.duration).reduce(sum, 0)
      const [from, to] = fromTo.map(m => m.format('YYYY-MM-DD'))
      print(
        `- ${rightPad(project.name, 20)}  ${rightPad(project.client, 15)}: ${leftPad(
          seconds,
          10
        )} seconds | ${from} - ${to}`
      )
    }
  }
}

// write will only work in nodejs on your own stack if AWS environment variables are provided
// write().then(() => print('\n\nDONE'))

read().then(() => print('\n\nDONE'))
