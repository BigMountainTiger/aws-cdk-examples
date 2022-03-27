import json
import boto3

client = boto3.client('kinesis')


def send(data):
    STREAM_NAME = 'MY-TEST-STREAM'
    PARTITION_KEY = 'MY-PARTITION'

    response = client.put_record(
        StreamName=STREAM_NAME,
        Data=json.dumps(data),
        PartitionKey=PARTITION_KEY
    )

    print(response)


if __name__ == '__main__':

    data = {
        'Entry': 'This is the No.2'
    }

    send(data)
