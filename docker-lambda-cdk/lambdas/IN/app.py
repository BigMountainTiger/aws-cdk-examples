import time
import datetime
import boto3

def work():
  bucket = 'logs.huge.head.li';
  file_name = '/var/task/invoice-template.txt';
  ts = datetime.datetime.fromtimestamp(time.time()).strftime(r'%Y-%m-%d-%H-%M-%S')
  object_name = f'G-{ts}.docx'

  s3 = boto3.resource('s3')
  s3.meta.client.upload_file(file_name, bucket, object_name)


def lambdaHandler(event, context):
    work()
    
    return f'{event} is received'