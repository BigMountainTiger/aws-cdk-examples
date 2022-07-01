# https://docs.python.org/3/library/http.client.html
# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.RequestFormat
# https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html

# This is to demonstrate that we can call dynamo with http request

import asyncio
import sys
import os
import datetime
import hashlib
import hmac
import json
import aiohttp

from dotenv import load_dotenv
load_dotenv()


async def test():
    region = 'us-east-1'

    method = 'POST'
    service = 'dynamodb'
    host = f'dynamodb.{region}.amazonaws.com'
    endpoint = f'https://dynamodb.{region}.amazonaws.com/'
    content_type = 'application/x-amz-json-1.0'
    amz_target = 'DynamoDB_20120810.GetItem'

    r = {
        'TableName': 'TABLE_1',
        'Key': {
            'id': {'S': '9'},
            'entry_time': {'S': 'entry_9'}
        }
    }

    request_parameters = json.dumps(r)

    def sign(key, msg):
        return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()

    def getSignatureKey(key, date_stamp, regionName, serviceName):
        kDate = sign(('AWS4' + key).encode('utf-8'), date_stamp)
        kRegion = sign(kDate, regionName)
        kService = sign(kRegion, serviceName)
        kSigning = sign(kService, 'aws4_request')
        return kSigning

    access_key = os.environ.get('AWS_ACCESS_KEY_ID')
    secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')

    if access_key is None or secret_key is None:
        print('No access key is available.')
        sys.exit()

    t = datetime.datetime.utcnow()
    amz_date = t.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = t.strftime('%Y%m%d')

    canonical_uri = '/'
    canonical_querystring = ''
    canonical_headers = 'content-type:' + content_type + '\n' + 'host:' + host + \
        '\n' + 'x-amz-date:' + amz_date + '\n' + 'x-amz-target:' + amz_target + '\n'
    signed_headers = 'content-type;host;x-amz-date;x-amz-target'

    payload_hash = hashlib.sha256(
        request_parameters.encode('utf-8')).hexdigest()

    canonical_request = method + '\n' + canonical_uri + '\n' + canonical_querystring + \
        '\n' + canonical_headers + '\n' + signed_headers + '\n' + payload_hash

    algorithm = 'AWS4-HMAC-SHA256'
    credential_scope = date_stamp + '/' + region + \
        '/' + service + '/' + 'aws4_request'
    string_to_sign = algorithm + '\n' + amz_date + '\n' + credential_scope + \
        '\n' + hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()

    signing_key = getSignatureKey(secret_key, date_stamp, region, service)

    signature = hmac.new(signing_key, (string_to_sign).encode(
        'utf-8'), hashlib.sha256).hexdigest()

    authorization_header = algorithm + ' ' + 'Credential=' + access_key + '/' + \
        credential_scope + ', ' + 'SignedHeaders=' + \
        signed_headers + ', ' + 'Signature=' + signature

    headers = {'Content-Type': content_type,
               'X-Amz-Date': amz_date,
               'X-Amz-Target': amz_target,
               'Authorization': authorization_header}

    print('\nBEGIN REQUEST++++++++++++++++++++++++++++++++++++')
    print('Request URL = ' + endpoint)

    async with aiohttp.ClientSession() as session:
        async with session.post(endpoint, data=request_parameters, headers=headers) as resp:
            print(resp.status)
            result = await resp.text()

    return result


def run():
    result = asyncio.run(test())
    print(result)


if __name__ == '__main__':
    run()
