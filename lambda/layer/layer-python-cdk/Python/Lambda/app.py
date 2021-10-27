import json
import pandas as pd

def lambdaHandler(event, context):
    
    series = pd.Series([2, 4, 6, 8])
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Pandas, max value is  ' + str(series.max()) )
    }