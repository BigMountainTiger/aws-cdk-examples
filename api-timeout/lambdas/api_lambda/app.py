# This is to demonstrate that when API Gateway times out, the lambda will be still running until finishes or its own timeout.

import json
import time

def lambdaHandler(event, context):

    req = json.loads(event['body'])
    

    for i, s in enumerate(req):
        print(f'{i + 1}. Sleeping for {s} seconds')
        time.sleep(s)
        print(f'{i + 1}. Sleeped for {s} seconds')

    print('Done the sleepings')

    return {
        'statusCode': 200,
        'body': json.dumps(req)
    }