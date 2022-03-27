from connection import es

index_name = 'test-index'


def print_indices():
    indices = es.cat.indices()
    print(indices)


def drop_test_index():

    if es.indices.exists(index_name):
        es.indices.delete(index=index_name)

    print_indices()


if __name__ == '__main__':

    drop_test_index()
