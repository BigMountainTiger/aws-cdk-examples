import psycopg2
from pprint import pprint

CONSTR = 'postgres://postgres:Password123@database-1.cw18weh1liqq.us-east-1.rds.amazonaws.com:5432/StudentDB'

def read_file():

  file_name = './images/tomato.jpeg'
  # file_name = './images/bird.jpg'
  with open(file_name, mode='rb') as file:
    file_content = file.read()

  return file_content
  

def connect():
  file_content = read_file()

  sql = 'update public.image_test set image_data = %s where id = %s'

  try:

    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()

    cur.execute(sql, [file_content, 2])

    conn.commit()
    cur.close()

  except (Exception) as error:
    print(error)

  finally:
    if conn is not None:
      conn.close()

if __name__ == '__main__':
  connect()
  print('Done')