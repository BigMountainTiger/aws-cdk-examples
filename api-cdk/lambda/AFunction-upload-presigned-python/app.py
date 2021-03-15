# https://stackoverflow.com/questions/65198959/aws-s3-generate-presigned-url-vs-generate-presigned-post-for-uploading-files

import boto3, json, time
from botocore.config import Config

bucket = 'api-cdk.huge.head.li'

def lambdaHandler(event, context):
    print(event)
    
    key = f'F-{int(time.time())}.jpg'

    client = boto3.client('s3', config=Config(signature_version='s3v4'))
    def get_presigned_url():
        expire = 60 * 60 * 24

        # PUT - use binary to send data from POSTMAN
        # return client.generate_presigned_url('put_object', Params = { 'Bucket': bucket, 'Key': key }, ExpiresIn = expire)

        # POST - testing
        return client.generate_presigned_post(Bucket = bucket, Key = key, ExpiresIn = expire)

    presigned_url = get_presigned_url()

    print(presigned_url)

    result = {
        'key': key,
        'presigned_url': presigned_url
    }

    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
        'body': json.dumps(result)
    }