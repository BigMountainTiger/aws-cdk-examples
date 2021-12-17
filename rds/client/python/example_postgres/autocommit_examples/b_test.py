import time
import psycopg2

CONSTR = 'postgres://postgres:Password123@db.bigmountaintiger.com:5432/StudentDB'

def truncate_table():

  sql = 'select clear_table()'
  conn = None
  items = None

  try:
    conn = psycopg2.connect(host='db.bigmountaintiger.com', database='StudentDB', user='postgres', password='Password123')

    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()

    items = cur.fetchone()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

  return items[0]

def get_count():
  
  conn = None
  items = None

  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute('select count(*) from example_table')
    items = cur.fetchone()

    cur.close()
  finally:
    if conn is not None:
      conn.close()

  return items[0]

def insert_a_by_function(no_of_rows):
  
  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    conn.autocommit = True

    cur = conn.cursor()
    cur.execute('select insert_rows_to_table(%s)', [no_of_rows])
    conn.commit()
    cur.close()
  except (Exception) as error:
    print(error)
  finally:
    if conn is not None:
      conn.close()

def insert_a_by_batch_function(no_of_rows):
  
  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    conn.autocommit = True

    cur = conn.cursor()
    cur.execute('select insert_batch_rows_to_table(%s)', [no_of_rows])
    conn.commit()
    cur.close()
  except (Exception) as error:
    print(error)
  finally:
    if conn is not None:
      conn.close()

def insert_one_by_one(no_of_rows):
  
  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    conn.autocommit = True

    cur = conn.cursor()
    for i in range(1, no_of_rows + 1):
      cur.execute(f"insert into example_table (item_text) values (lpad({i}::varchar, 10, '0'))")

    cur.close()
  except (Exception) as error:
    print(error)
  finally:
    if conn is not None:
      conn.close()

def insert_by_one_statement(no_of_rows):

  sql = 'insert into example_table (item_text) values'
  for i in range(1, no_of_rows + 1):
    sql += f"(lpad({i}::varchar, 10, '0')),"
  sql = sql[:-1]
  
  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    # conn.autocommit = True

    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    cur.close()
  except (Exception) as error:
    print(error)
  finally:
    if conn is not None:
      conn.close()




if __name__ == '__main__':
  row_count = truncate_table()
  print(f'Truncated table - current row count = {row_count}')

  start_time = time.perf_counter()
  insert_a_by_function(100 * 1000)
  # insert_a_by_batch_function(100 * 1000)
  # insert_one_by_one(20)
  # insert_by_one_statement(2)

  end_time = time.perf_counter()
  print(f'Finished in {(end_time - start_time) * 1000} (ms)')

  print(f'Final table - final row count = {get_count()}')

  print('Done')