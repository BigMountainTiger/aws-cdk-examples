import boto3, json, time
from botocore.config import Config

bucket = 'api-cdk.huge.head.li'

def lambdaHandler(event, context):
    parameters = event['pathParameters']
    key = parameters['key']
    file_name = 'song-bird.jpg'

    def get_presigned_url():
        params = {
            'Bucket': bucket,
            'Key': key,
            'ResponseContentDisposition': f'attachment; filename ="{file_name}"'
        }
        client = boto3.client('s3', config=Config(signature_version='s3v4'))
        return client.generate_presigned_url('get_object', Params = params, ExpiresIn = 60 * 60 * 24)

    presigned_url = get_presigned_url()
    result = {
        'key': key,
        'presigned_url': presigned_url
    }

    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
        'body': json.dumps(result)
    }