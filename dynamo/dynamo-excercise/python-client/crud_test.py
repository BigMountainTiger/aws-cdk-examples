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


def get_item_example():
    tb = get_table()

    response = tb.get_item(Key={"id": '9', 'entry_time': 'entry_9'})
    item = response.get('Item')

    print('Get item example')
    print(item)


def query_example():
    tb = get_table()

    response = tb.query(KeyConditionExpression=Key(
        'id').eq('9') & Key('entry_time').eq('entry_9'))
    items = response.get('Items')

    print('Query example')
    print(items)


def update_example():
    tb = get_table()

    response = tb.update_item(
        Key={
            'id': '8',
            'entry_time': 'entry_8'
        },
        UpdateExpression="set attr = :r",
        ExpressionAttributeValues={
            ':r': 'The attr is updated',
        },
        ReturnValues="UPDATED_NEW"
    )

    item = response.get('Attributes')

    print('Update item example')
    response = tb.get_item(Key={"id": '8', 'entry_time': 'entry_8'})
    item = response.get('Item')
    print(item)


def delete_example():
    tb = get_table()

    key = {
        'id': '1',
        'entry_time': 'entry_1'
    }

    response = tb.delete_item(Key=key)

    print('Delete item example')
    response = tb.get_item(Key=key)
    item = response.get('Item')
    print(f'{item} - indicates the entry deleted')


def run():
    truncate()
    init_test_data()
    scan_example()
    get_item_example()
    query_example()
    update_example()
    delete_example()


if __name__ == '__main__':
    run()
