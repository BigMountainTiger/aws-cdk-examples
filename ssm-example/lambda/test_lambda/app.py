import os, boto3, json

def lambdaHandler(event, context):

  result = {
    'OK': 'OK'
  }

  return {
    'statusCode': 200,
    'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    'body': json.dumps(result)
  }
  