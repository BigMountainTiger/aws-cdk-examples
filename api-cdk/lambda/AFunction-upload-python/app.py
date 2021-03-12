# https://stackoverflow.com/questions/50925083/parse-multipart-request-string-in-python

import base64
from requests_toolbelt.multipart import decoder
import json

def lambdaHandler(event, context):
    
    # content_type = event['headers']['Content-Type'];
    # body = base64.b64decode(event['body']).decode('ISO-8859-1')
    
    # form_data = decoder.MultipartDecoder(body.encode('utf-8'), content_type).parts
    
    # print(form_data[0])
    # print(form_data[1])
    
    
    # multipart_string = b"--ce560532019a77d83195f9e9873e16a1\r\nContent-Disposition: form-data; name=\"author\"\r\n\r\nJohn Smith\r\n--ce560532019a77d83195f9e9873e16a1\r\nContent-Disposition: form-data; name=\"file\"; filename=\"example2.txt\"\r\nContent-Type: text/plain\r\nExpires: 0\r\n\r\nHello World\r\n--ce560532019a77d83195f9e9873e16a1--\r\n"
    # content_type = "multipart/form-data; boundary=ce560532019a77d83195f9e9873e16a1"
    # result = decoder.MultipartDecoder(multipart_string, content_type).parts

    # print(result)
    return {
        'statusCode': 200,
        'body': json.dumps(event)
    }