from common import db
import pymssql


def print_current():
    r = db.fetchone('SELECT * FROM Test_table')
    print(r)


def run():

    print_current()

    with pymssql.connect(
        server='db.bigmountaintiger.com',
        port='1433',
        user='sqluser',
        password='Password123',
        database='experiment'
    ) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE Test_table SET update_count = update_count + 1")

        conn.commit()

    print_current()


if __name__ == '__main__':
    run()
