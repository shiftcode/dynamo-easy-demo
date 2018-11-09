const SEPARATOR = '-'

export class ClientProject {
  static parse(value: string): ClientProject {
    const parts = value.split(SEPARATOR)
    if (parts.length !== 2) {
      throw new Error(`invalid input value: '${value}'`)
    }
    return new ClientProject(parts[0], parts[1])
  }

  static unparse({ client, project }: ClientProject): string {
    return [client, project].join(SEPARATOR)
  }
  constructor(public client: string, public project: string) {}
}
