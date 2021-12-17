import psycopg2

# Connection string here
CONSTR = 'postgres://postgres:Password123@database-1.cw18weh1liqq.us-east-1.rds.amazonaws.com:5432/ExperimentDB'


def fetchall(sql, params=[]):
    return __execute__(sql, params, lambda cur: cur.fetchall())


def fetchone(sql, params=[]):
    return __execute__(sql, params, lambda cur: cur.fetchone())


def execute(sql, params=[]):
    return __execute__(sql, params, lambda cur: None)


def __execute__(sql, params, fetch):

    try:
        conn = psycopg2.connect(CONSTR)
        cur = conn.cursor()
        cur.execute(sql, params)
        result = fetch(cur)

        conn.commit()
        cur.close()

    finally:
        if conn is not None:
            conn.close()

    return result


class batch:
    def __init__(self):
        self.conn = psycopg2.connect(CONSTR)
        self.conn.autocommit = False

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.close()

    def __execute__(self, sql, params, fetch):
        cur = self.conn.cursor()
        cur.execute(sql, params)
        result = fetch(cur)
        cur.close()

        return result

    def fetchall(self, sql, params=[]):
        return self.__execute__(sql, params, lambda cur: cur.fetchall())

    def fetchone(self, sql, params=[]):
        return self.__execute__(sql, params, lambda cur: cur.fetchone())

    def execute(self, sql, params=[]):
        return self.__execute__(sql, params, lambda cur: None)

    def rollback(self):
        self.conn.rollback()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()
