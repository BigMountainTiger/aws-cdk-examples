import db


def use_execute_directly():

    file_path = '../../../sql/context_manager_examples/ddl.sql'
    with open(file_path, 'r') as file:
        script = file.read()

    # Using execute directly
    db.execute(script)

    print('Done')


if __name__ == '__main__':
    use_execute_directly()
