import boto3, json, time

bucket = 'api-cdk.huge.head.li'

def lambdaHandler(event, context):
    print(event)
    
    key = f'F-{int(time.time())}.jpg'

    client = boto3.client('s3')
    # def get_presigned_url():
    #     return client.generate_presigned_url('get_object', Params = { 'Bucket': bucket, 'Key': key }, ExpiresIn = 60 * 60 * 24)

    # presigned_url = get_presigned_url()

    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' },
        'body': json.dumps(key)
    }