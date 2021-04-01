import os, boto3, json

def lambdaHandler(event, context):
  env_key = 'env_key'
  env_value = os.environ[env_key]

  ssm = boto3.client('ssm')

  print('Start getting the parameter')

  try:
    parameter = ssm.get_parameter(Name = env_value, WithDecryption = False)
  except:
    parameter = None

  print(parameter)

  result = {
    'env': env_value,
    'ssm_value': 'Not found' if parameter is None else parameter['Parameter']['Value']
  }

  return {
    'statusCode': 200,
    'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    'body': json.dumps(result)
  }
  