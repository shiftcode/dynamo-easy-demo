import 'reflect-metadata' // needs to be imported before any models are used
import { EmployeeService, TimeEntryService } from './services/index.js'
import { print } from './static/print.function.js'
import { Employee, Project, TimeEntry } from './model/index.js'
import { FnsDate } from './static/fns-date.js'
import {
  BatchWriteRequest,
  TransactConditionCheck,
  TransactUpdate,
  TransactWriteRequest,
} from '@shiftcoders/dynamo-easy'
import { createRandomDateFn } from './static/helper.js'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { CONFIG } from './static/config.js'
import { createDynamoEasyConfig } from './create-dynamo-easy-config.js'

createDynamoEasyConfig()

/*
 * Make sure that you have a valid configuration so the aws-sdk can get a valid session
 */
const dynamoDB = new DynamoDB({ region: CONFIG.AwsRegion })

try {
  await write()
} catch (err) {
  console.error(`Error writing data`, err)
}

async function write() {
  const employeeService = new EmployeeService(dynamoDB)
  const timeEntryService = new TimeEntryService(dynamoDB)

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
  await new BatchWriteRequest(dynamoDB).put(Project, projects).put(Employee, employees).exec()

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
  await new TransactWriteRequest(dynamoDB)
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
