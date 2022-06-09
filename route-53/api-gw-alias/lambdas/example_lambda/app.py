import imp
import json
import boto3

def lambdaHandler(event, context):

    session = boto3.session.Session()
    region = session.region_name


    return {
        'statusCode': 200,
        'body': json.dumps(f'API Call successful - {region}')
    }