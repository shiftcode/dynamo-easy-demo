import 'reflect-metadata' // needs to be imported before any models are used
import { DynamoDB } from '@aws-sdk/client-dynamodb'
// tslint:disable-next-line:no-implicit-dependencies no-submodule-imports
import { updateDynamoEasyConfig } from '@shiftcoders/dynamo-easy'

import { Employee } from './model/index.js'
import { EmployeeService, ProjectService, TimeEntryService } from './services/index.js'
import { AnonymousAuthService } from './services/anonymous-auth.service.js'
import { CONFIG } from './static/config.js'
import { FnsDate } from './static/fns-date.js'
import { leftPad, rightPad, sum } from './static/helper.js'
import { print } from './static/print.function.js'
import { createDynamoEasyConfig } from './create-dynamo-easy-config.js'

createDynamoEasyConfig()

// FIXME replace with actual values
const dynamoDB = new DynamoDB({
  region: CONFIG.AwsRegion,
  credentials: { accessKeyId: CONFIG.accessKeyId, secretAccessKey: CONFIG.secretAccessKey },
})

// dynamoDB.middlewareStack.add((next, context) => {
//   return async (args: InitializeHandlerArguments<any>): Promise<InitializeHandlerOutput<any>> => {
//     console.log(`args`, args)
//     console.log(`context`, context)
//     const response = await next(args)
//     return response
//   }
// })

async function read() {
  // set aws config before instantiating DynamoStore
  // (which itself creates DynamoDB instance from AWS which needs the config)
  updateDynamoEasyConfig({
    // used to make sure the aws credentials are set and valid before making a call to dynamoDb
    sessionValidityEnsurer: new AnonymousAuthService().sessionValidityEnsurer,
  })

  const employeeService = new EmployeeService(dynamoDB)
  const projectService = new ProjectService(dynamoDB)
  const timeEntryService = new TimeEntryService(dynamoDB)

  {
    print('\nemployees first month')

    const employees = await employeeService.getAll()

    for (const employee of employees) {
      const monthToFetch = employee.employment

      const timeEntriesFirstMonth = await timeEntryService.getByEmployeeAndMonth(employee, monthToFetch)

      const seconds = timeEntriesFirstMonth.map((t) => t.duration).reduce(sum, 0)
      print(
        `- ${rightPad(employee.name, 20)} worked ${leftPad(seconds, 7)} seconds in ${leftPad(
          monthToFetch.format('MMMM yyyy'),
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
      print(`- '${proj.name}' from ${proj.client} started on ${proj.creationDate.format('yyyy-MM-dd')}`)
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
      const seconds = timeEntries.map((t) => t.duration).reduce(sum, 0)
      const [from, to] = fromTo.map((m) => m.format('yyyy-MM-dd'))
      print(
        `- ${rightPad(project.name, 20)}  ${rightPad(project.client, 15)}: ${leftPad(
          seconds,
          10
        )} seconds | ${from} - ${to}`
      )
    }
  }
}

// write will only work if you deploy the stack to your own AWS account and add an appropriate IAM Policy.
// write().then(() => print('\n\nDONE'))

read().then(() => print('\n\nDONE'))
