import sys
import json
import docx_merge
import testdata
import util

def lambdaHandler(event, context):
  body = event['body']
  data = json.loads(body)

  # data = testdata.get_test_data()

  docx_merge.merge(data)
  util.doc2pdf()
  presigned_url = util.upload2s3()

  return {
    'statusCode': 200,
    'body': json.dumps({
      'presigned_url': presigned_url
    })
  }

if __name__ == '__main__':
  lambdaHandler({'body': {}}, {})