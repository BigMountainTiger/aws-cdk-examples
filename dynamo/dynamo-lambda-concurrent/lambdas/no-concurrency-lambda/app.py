import json
import time

def lambdaHandler(event, context):

  time.sleep(10)
  
  return {
    'statusCode': 200,
    'body': json.dumps('OK')
  }