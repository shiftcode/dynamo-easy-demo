# DynamoDB Local with the dynamo-easy-demo tables ready.
#   docker build -t dynamo-easy-demo-db local-dynamodb
#   docker run --rm -p 8000:8000 dynamo-easy-demo-db
# Every new container starts with the empty tables; data written at runtime is dropped with the container.
FROM amazon/dynamodb-local:3.3.2

COPY --chown=dynamodblocal:dynamodblocal tables/ /tmp/tables/
COPY --chown=dynamodblocal:dynamodblocal create-tables.sh /tmp/create-tables.sh

RUN mkdir -p /home/dynamodblocal/data \
 && sh /tmp/create-tables.sh \
 && rm -rf /tmp/tables /tmp/create-tables.sh

EXPOSE 8000
CMD ["-jar", "DynamoDBLocal.jar", "-sharedDb", "-dbPath", "/home/dynamodblocal/data"]
