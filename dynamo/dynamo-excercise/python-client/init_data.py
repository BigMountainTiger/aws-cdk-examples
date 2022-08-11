import boto3
from boto3.dynamodb.conditions import Key, Attr


def get_table():
    NAME = 'TABLE_1'
    dynamo = boto3.resource('dynamodb', region_name='us-east-1')
    return dynamo.Table(NAME)


def truncate():
    tb = get_table()

    tableKeyNames = [key.get("AttributeName") for key in tb.key_schema]
    expression = ", ".join(tableKeyNames)
    response = tb.scan(ProjectionExpression=expression)
    data = response.get('Items')

    while 'LastEvaluatedKey' in response:
        response = tb.scan(
            ProjectionExpression=expression,
            ExclusiveStartKey=response['LastEvaluatedKey']
        )
        data.extend(response['Items'])

    with tb.batch_writer() as batch:
        for each in data:
            batch.delete_item(Key={key: each[key] for key in tableKeyNames})


def init_test_data():
    tb = get_table()

    with tb.batch_writer() as writer:
        for i in range(10):
            writer.put_item(Item={
                'id': f'{i}',
                'entry_time': f'entry_{i}',
                'attr': f'attr_{i}'
            })


def scan_example():
    tb = get_table()

    response = tb.scan()
    items = response.get('Items')

    print('Scan example')
    for item in items:
        print(item)

    response = tb.scan(FilterExpression=Attr('id').is_in(('1', '9')))
    items = response.get('Items')

    print('Scan with filter example')
    for item in items:
        print(item)


def run():
    truncate()
    init_test_data()
    scan_example()


if __name__ == '__main__':
    run()
