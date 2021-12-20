import pymssql

def fetchall(sql, params=[]):
    return __execute__(sql, params, lambda cur: cur.fetchall())


def fetchone(sql, params=[]):
    return __execute__(sql, params, lambda cur: cur.fetchone())


def execute(sql, params=[]):
    return __execute__(sql, params, lambda cur: None)


def __execute__(sql, params, fetch):

    try:
        conn = pymssql.connect(
            server='db.bigmountaintiger.com',
            port='1433',
            user='sqluser',
            password='Password123',
            database='experiment'
        )

        cur = conn.cursor()
        cur.execute(sql, params)
        result = fetch(cur)

        conn.commit()
        cur.close()

    finally:
        if conn is not None:
            conn.close()

    return result
