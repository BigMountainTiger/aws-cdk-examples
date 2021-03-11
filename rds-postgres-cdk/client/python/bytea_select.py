import os
import psycopg2
from pprint import pprint

CONSTR = 'postgres://postgres:Password123@database-1.cw18weh1liqq.us-east-1.rds.amazonaws.com:5432/StudentDB'  

def save_to_file(file_id, file_content):
  directory = './images/save-to-file/'
  if not os.path.exists(directory):
    os.makedirs(directory)

  f = open(f'{directory}{file_id}.jpg', 'wb')
  f.write(file_content)
  f.close()

def connect():

  sql = 'select * from public.image_test where id = %s'

  try:

    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()

    cur.execute(sql, [2])

    row = cur.fetchone()
    cur.close()

    file_id = row[0]
    file_content = row[1].tobytes()

    save_to_file(file_id, file_content)

  except (Exception) as error:
    print(error)

  finally:
    if conn is not None:
      conn.close()

if __name__ == '__main__':
  connect()
  print('Done')