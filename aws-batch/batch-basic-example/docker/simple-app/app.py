import time
import datetime
import boto3

# Use an existing S3 bucket - example.huge.head.li


def upload2s3():
    bucket = 'example.huge.head.li'

    ts = datetime.datetime.fromtimestamp(
        time.time()).strftime(r'%Y-%m-%d-%H-%M-%S')
    object_name = f'G-{ts}.txt'

    client = boto3.client('s3')
    client.put_object(Body='Hello', Bucket=bucket, Key=object_name)


def run():
    upload2s3()
    print('OK')


if __name__ == '__main__':
    run()
