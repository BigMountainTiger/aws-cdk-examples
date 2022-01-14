import json

def lambdaHandler(event, context):

  return {
    'statusCode': 200,
    'headers': { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
    'body': json.dumps('OK')
  }