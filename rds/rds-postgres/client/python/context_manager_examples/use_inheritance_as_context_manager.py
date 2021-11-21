import db


class run_script_context(db.batch):

    def run_script(self):
        file_path = '../../../sql/context_manager_examples/ddl.sql'
        with open(file_path, 'r') as file:
            script = file.read()

        self.execute(script)
        self.commit()


def use_batch_as_context_manager():

    # By inheritance, all the method is available from db.batch
    with run_script_context() as context:
        context.run_script()

    print('Done')


if __name__ == '__main__':
    use_batch_as_context_manager()
