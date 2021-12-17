import psycopg2
from pprint import pprint

CONSTR = 'postgres://postgres:Password123@db.bigmountaintiger.com:5432/StudentDB'

def connect():

  conn = None

  try:

    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()

    cur.execute('SELECT version()')
    db_version = cur.fetchone()
    cur.close()

    print(db_version)

  except (Exception) as error:
    print(error)

  finally:
    if conn is not None:
      conn.close()

if __name__ == '__main__':
  connect()
  print('Done')