import psycopg2
from pprint import pprint

CONSTR = 'postgres://postgres:Password123@database-1.cw18weh1liqq.us-east-1.rds.amazonaws.com:5432/StudentDB'

def connect():

  conn = None

  # sql = 'select id, name from public.student where name = (%s)'
  sql = 'select id, name from public.student'

  try:

    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()

    # cur.execute(sql, ('Song Li',))
    cur.execute(sql)

    rows = cur.fetchall()

    cur.close()

    print(rows)

  except (Exception) as error:
    print(error)

  finally:
    if conn is not None:
      conn.close()

if __name__ == '__main__':
  connect()
  print('Done')