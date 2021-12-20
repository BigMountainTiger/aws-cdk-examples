from common import db
import pymssql


def run():

    file_path = 'scripts/createdb.sql'
    with open(file_path, 'r') as file:
        script = file.read()

    with pymssql.connect(
        server='db.bigmountaintiger.com',
        port='1433',
        user='sqluser',
        password='Password123',
        database='master'
    ) as conn:
        # Need to set autocommit to run drop/create DB DDLs
        conn.autocommit(True)
        with conn.cursor() as cur:
            cur.execute(script)

    r = db.fetchone('SELECT * FROM Test_table')
    print(r)


if __name__ == '__main__':
    run()
