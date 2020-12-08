import sys
sys.path.append('/var/task/pip')
sys.path.append('/var/task/docx_merge')

import time, datetime, boto3, docx_merge

def upload2s3(content):
  bucket = 'logs.huge.head.li';
  ts = datetime.datetime.fromtimestamp(time.time()).strftime(r'%Y-%m-%d-%H-%M-%S')
  object_key = f'G-{ts}.docx'

  client = boto3.client('s3')
  client.put_object(Body = content, Bucket = bucket, Key = object_key)


def lambdaHandler(event, context):
  content = docx_merge.merge()

  upload2s3(content)
  
  return f'{event} is received'