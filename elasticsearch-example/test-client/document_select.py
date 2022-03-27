import json
from connection import es


def pretty_print(s):
    print(json.dumps(s, indent=4, sort_keys=True))


index_name = 'test-index'


def select_documents():
    result = es.search(index=index_name, body={
                       'query': {'match': {'author': 'song'}}})
    print(pretty_print(result))


if __name__ == '__main__':

    select_documents()
