# https://stackoverflow.com/questions/50925083/parse-multipart-request-string-in-python

import boto3
import base64
from requests_toolbelt.multipart import decoder
import json
import time

bucket = 'api-cdk.huge.head.li'

def lambdaHandler(event, context):

    content_type = event['headers']['Content-Type']
    body = base64.b64decode(event['body'])
    
    form_data = decoder.MultipartDecoder(body, content_type).parts
    part = form_data[0]

    # print(part.headers)
    # print(part.content)
    
    key = f'F-{int(time.time())}.jpg'
    client = boto3.client('s3')
    def get_presigned_url():
        client.put_object(Body = part.content, Bucket = bucket, Key = key)
        # ExpiresIn - time in second
        return client.generate_presigned_url('get_object', Params = { 'Bucket': bucket, 'Key': key }, ExpiresIn = 100)

    presigned_url = get_presigned_url()

    return {
        'statusCode': 200,
        'body': presigned_url
    }