from connection import es

index_name = 'test-index'


def print_indices():
    indices = es.cat.indices()
    print(indices)


def create_test_index():

    print_indices()
    es.indices.create(index=index_name, ignore=400)

    print_indices()


if __name__ == '__main__':

    create_test_index()
