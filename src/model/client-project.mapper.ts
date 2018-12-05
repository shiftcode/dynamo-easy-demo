import { MapperForType, StringAttribute } from '@shiftcoders/dynamo-easy'
import { ClientProject } from './client-project.model'

export const clientProjectMapper: MapperForType<ClientProject, StringAttribute> = {
  fromDb: attributeValue => ClientProject.parse(attributeValue.S),
  toDb: propertyValue => ({ S: `${ClientProject.unparse(propertyValue)}` }),
}
