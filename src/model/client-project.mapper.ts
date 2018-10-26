import { MapperForType, PropertyMetadata } from '@shiftcoders/dynamo-easy'
import { DynamoDB } from 'aws-sdk'
import { ClientProject } from './client-project.model'


export class ClientProjectMapper implements MapperForType<ClientProject> {

  fromDb(attributeValue: DynamoDB.AttributeValue, propertyMetadata?: PropertyMetadata<ClientProject>): ClientProject {
    return ClientProject.parse(attributeValue.S!)
  }

  toDb(propertyValue: ClientProject, propertyMetadata?: PropertyMetadata<ClientProject>): DynamoDB.AttributeValue {
    return { S: `${ClientProject.unparse(propertyValue)}` }
  }

}