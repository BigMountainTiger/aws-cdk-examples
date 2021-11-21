import db


def use_batch_as_context_manager():

    file_path = '../../../sql/context_manager_examples/ddl.sql'
    with open(file_path, 'r') as file:
        script = file.read()

    # Using batch class as a context manager
    with db.batch() as b:
        b.execute(script)
        b.commit()

    print('Done')


if __name__ == '__main__':
    use_batch_as_context_manager()
