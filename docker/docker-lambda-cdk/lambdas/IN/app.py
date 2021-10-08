import sys
sys.path.append('/var/task/pip')
sys.path.append('/var/task/docx_merge')

import boto3, json, base64, docx_merge

def lambdaHandler(event, context):
  body = event['body']
  data = json.loads(body)

  content = docx_merge.merge(data)
  base64_content = base64.b64encode(content.read()).decode("utf-8")

  lambda_name = 'DOCKER-Lambda-CDK-STACK-PDF';
  payload = {
    'Payload': base64_content
  }

  client = boto3.client('lambda')
  response = client.invoke(
    FunctionName = lambda_name,
    Payload = json.dumps(payload)
  )

  str_payload = response['Payload'].read().decode("utf-8")
  payload = json.loads(str_payload)
  presigned_url = payload['Payload']

  return {
    'statusCode': 200,
    'body': json.dumps({
      'presigned_url': presigned_url
    })
  }