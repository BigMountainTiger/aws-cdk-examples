# This experiment is also a batch and context manager example
# Look the details in the db.py file
import db


# This class inherit from batch, so it is automatically a context manager
class new_batch(db.batch):
    def lock_example(self):
        STATEMENT_TIMEOUT = "SET statement_timeout = %s;"
        # 2000 = 2 seconds
        self.execute(STATEMENT_TIMEOUT, (2000, ))

        try:
            self.execute("LOCK TABLE a_table IN ACCESS EXCLUSIVE MODE")
        except Exception as e:
            raise ValueError(
                'Another transaction is going on, please send the request after it finishes')

        # https://postgresqlco.nf/doc/en/param/statement_timeout/
        # 0 = No timeout
        self.execute(STATEMENT_TIMEOUT, (0, ))


if __name__ == '__main__':
    # Use as context manager c lose method will be called when complete
    with new_batch() as b:
        b.lock_example()
