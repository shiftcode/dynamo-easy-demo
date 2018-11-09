import { MapperForType, PropertyMetadata, StringAttribute } from '@shiftcoders/dynamo-easy'
import { ClientProject } from './client-project.model'


export class ClientProjectMapper implements MapperForType<ClientProject, StringAttribute> {

  fromDb(attributeValue: StringAttribute, propertyMetadata?: PropertyMetadata<ClientProject>): ClientProject {
    return ClientProject.parse(attributeValue.S!)
  }

  toDb(propertyValue: ClientProject, propertyMetadata?: PropertyMetadata<ClientProject>): StringAttribute {
    return { S: `${ClientProject.unparse(propertyValue)}` }
  }

}