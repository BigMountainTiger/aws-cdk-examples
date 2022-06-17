import json
import logging



def lambdaHandler(event, context):

    logging.getLogger('codeguru_profiler_agent').setLevel(logging.INFO)

    return {
        'statusCode': 200,
        'body': json.dumps('API Call successful')
    }
