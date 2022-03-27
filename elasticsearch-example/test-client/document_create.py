import json
from connection import es


def pretty_print(s):
    print(json.dumps(s, indent=4, sort_keys=True))

index_name = 'test-index'

def add_documents():

    es.delete(index=index_name, id=1, ignore=[404])
    es.delete(index=index_name, id=2, ignore=[404])

    doc = {
        'author': 'kimchy',
        'text': 'Elasticsearch: cool. bonsai cool.'
    }

    es.create(index_name, id=1, body=doc)

    doc = {
        'author': 'song',
        'text': 'whatever it is'
    }

    es.create(index_name, id=2, body=doc)


if __name__ == '__main__':

    add_documents()
