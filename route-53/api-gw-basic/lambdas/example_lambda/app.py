import json

def lambdaHandler(event, context):

    return {
        'statusCode': 200,
        'body': json.dumps('API Call successful - Now')
    }