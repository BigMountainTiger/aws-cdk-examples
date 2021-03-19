import os, boto3, json, time, uuid
from botocore.config import Config

bucket = 'api-cdk.huge.head.li'

def lambdaHandler(event, context):

  print(event['pathParameters']['file_name'])

  expire = 60 * 60 * 24
  file_name = event['pathParameters']['file_name']
  key = f'F-{int(time.time())}-{str(uuid.uuid4()).upper()}/{file_name}'
  client = boto3.client('s3', config=Config(signature_version='s3v4'))

  def generate_get_url():

    params = {
        'Bucket': bucket,
        'Key': key,
        'ResponseContentDisposition': f'attachment; filename ="{file_name}"'
    }

    return client.generate_presigned_url(
      'get_object',
      Params = params,
      ExpiresIn = expire
    )

  def generate_post_url():

    return client.generate_presigned_post(
      Bucket = bucket,
      Key = key, 
      ExpiresIn = expire
    )

  def generate_put_url():

    params = {
        'Bucket': bucket,
        'Key': key
    }

    return client.generate_presigned_url(
      'put_object',
      Params = params,
      ExpiresIn = expire
    )
  

  result = {
    'get_url': generate_get_url(),
    'post_url': generate_post_url(),
    'put_url': generate_put_url()
  }

  return {
    'statusCode': 200,
    'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    'body': json.dumps(result)
  }
  