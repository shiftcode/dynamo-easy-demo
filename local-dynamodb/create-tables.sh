#!/bin/sh
# Runs at image build time: starts DynamoDB Local against a file-backed db,
# creates every table in ./tables/*.json (CreateTable API input, mirrors infrastructure.yml) and stops again.
set -eu

DATA_DIR=/home/dynamodblocal/data
ENDPOINT=http://localhost:8000

java -jar DynamoDBLocal.jar -sharedDb -dbPath "$DATA_DIR" &
PID=$!

ddb() { # $1 = operation, $2 = json body
  # DynamoDB Local does not verify signatures, but expects a SigV4-shaped Authorization header
  curl -sS --fail-with-body "$ENDPOINT" \
    -H 'Content-Type: application/x-amz-json-1.0' \
    -H "X-Amz-Target: DynamoDB_20120810.$1" \
    -H 'Authorization: AWS4-HMAC-SHA256 Credential=local/20240101/eu-central-1/dynamodb/aws4_request, SignedHeaders=host, Signature=local' \
    -d "$2"
}

i=0
until ddb ListTables '{}' >/dev/null 2>&1; do
  i=$((i + 1))
  [ "$i" -gt 60 ] && { echo "DynamoDB Local did not start" >&2; exit 1; }
  sleep 0.5
done

for f in /tmp/tables/*.json; do
  echo "creating table from $f"
  ddb CreateTable "$(cat "$f")" >/dev/null
done

echo "tables:"
ddb ListTables '{}'
echo

kill "$PID"
wait "$PID" || true
