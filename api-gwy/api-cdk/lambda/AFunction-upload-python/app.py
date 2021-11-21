# https://stackoverflow.com/questions/50925083/parse-multipart-request-string-in-python

import boto3, base64, json, time
from requests_toolbelt.multipart import decoder

bucket = 'api-cdk.huge.head.li'

def lambdaHandler(event, context):

    headers = event['headers']
    content_type = headers['Content-Type'] if 'Content-Type' in headers else headers['content-type']

    # This code can only handle base64 encoded
    # Need to work on Non-base64 encoded case
    isBase64 = event['isBase64Encoded']

    # In the CDK, if the binaryMediaTypes: ['multipart/form-data'] specified on the API level, it is base64 encoded, otherwise, it is not
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
        return client.generate_presigned_url('get_object', Params = { 'Bucket': bucket, 'Key': key }, ExpiresIn = 60 * 60 * 24)

    presigned_url = get_presigned_url()

    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
        'body': json.dumps(presigned_url)
    }