import json
import math

# http://127.0.0.1:3000/136000/ => Max count = 136000
def lambdaHandler(event, context):
  count = math.floor(float(event['pathParameters']['count']))

  data = []
  for i in range(1, count + 1):
    data.append({
      'ID': i,
      'Number': f'A{str(i).zfill(10)}'
    })
  
  body = json.dumps(data)
  return {
    'statusCode': 200,
    'body': body
  }
