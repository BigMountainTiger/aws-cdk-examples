import http.client
import json

URL = '9barnc7byj.execute-api.us-east-1.amazonaws.com'
PATH = '/prod/external-func-slack-notification'


def send_message(slack_id, text):

    URL = '9barnc7byj.execute-api.us-east-1.amazonaws.com'

    msg = {
        'data': [[0, slack_id, text]]
    }

    print(json.dumps(msg))

    con = http.client.HTTPSConnection(URL)
    try:
        con.request('POST', PATH, json.dumps(msg), {})
        resRaw = con.getresponse()
        resObj = json.loads(resRaw.read().decode())

        print(resObj)

    finally:
        con.close()


def lambda_handler(event, context):
    print(event)
    event_text = json.dumps(event)

    RECIPIENTS = [
        'U0101CPEW5U'
    ]

    msg = f'Data ingestion failed\n```{event_text}```'
    for slack_id in RECIPIENTS:
        try:
            send_message(slack_id.strip(), msg)
        except Exception as e:
            print(e)
            print(f'Failed to send message to {slack_id}')

    raise Exception(event_text)
    return {}
