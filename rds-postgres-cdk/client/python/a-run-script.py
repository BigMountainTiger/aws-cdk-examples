import psycopg2
from pprint import pprint

CONSTR = 'postgres://postgres:Password123@database-1.cw18weh1liqq.us-east-1.rds.amazonaws.com:5432/StudentDB'

def connect():

  conn = None

  try:

    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()

    file_path = '../../sql/ddl.sql'
    sql_file = open(file_path,'r')
    script = sql_file.read()
    cur.execute(script)

    conn.commit()

    cur.close()


  except (Exception, psycopg2.DatabaseError) as error:
    print(error)

  finally:
    if conn is not None:
      conn.close()

if __name__ == '__main__':
  connect()
  print('Done')