import json
import identifier

def lambdaHandler(event, context):
  file = '/opt/files/recording.wav'
  result = identifier.identify(file)

  return {
    'statusCode': 200,
    'headers': { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
    'body': json.dumps(result)
  }