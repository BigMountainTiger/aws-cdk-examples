import json

def lambdaHandler(event, context):
  body = event['body'] or '{}'
  data = json.loads(body)

  entry = 'service1'
  if entry not in data:
    print(f'{entry} is not in data')

  # print(data['service'])

  return {
    'statusCode': 200,
    'body': json.dumps({
      'event': event
    })
  }