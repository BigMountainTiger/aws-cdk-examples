import json

def lambdaHandler(event, context):
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Pandas, max value')
    }