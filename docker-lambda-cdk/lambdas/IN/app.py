import sys
sys.path.append('/var/task/pip')
sys.path.append('/var/task/docx_merge')

import time, datetime, boto3, json, base64, docx_merge

def upload2s3(content):
  bucket = 'logs.huge.head.li';
  ts = datetime.datetime.fromtimestamp(time.time()).strftime(r'%Y-%m-%d-%H-%M-%S')
  object_key = f'G-{ts}.docx'

  client = boto3.client('s3')
  client.put_object(Body = content, Bucket = bucket, Key = object_key)


def lambdaHandler(event, context):
  body = event['body']
  data = json.loads(body)

  content = docx_merge.merge(data)
  base64_content = base64.b64encode(content.read()).decode("utf-8")
  # upload2s3(content)

  lambda_name = 'DOCKER-Lambda-CDK-STACK-PDF';
  payload = {
    'Payload': base64_content
  }

  client = boto3.client('lambda')
  response = client.invoke(
    FunctionName = lambda_name,
    Payload = json.dumps(payload)
  )

  print(response)

  return {
    'statusCode': 200,
    'body': '"Success"'
  }