import time
import psycopg2

CONSTR = 'postgres://postgres:Password123@db.bigmountaintiger.com:5432/StudentDB'

def getMax():
  conn = None

  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute('select coalesce(MAX(id), 0) from batch_table bt')
    result = cur.fetchone()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

  return result[0]

def batchInsert(a, count):
  sql = 'insert into batch_table (id, item) values'
  for i in range(a, a + count):
    sql += f"({i}, 'A{str(i).zfill(10)}'),"
  sql = sql[:-1]

  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

def run():
  a = getMax() + 1

  start_time = time.perf_counter()
  # Test insert duplicate key
  # a = 50000
  batchInsert(a, 100000)

  end_time = time.perf_counter()
  print(f'Finished in {round(end_time - start_time, 2)} second(s)')

if __name__ == '__main__':
  run()
  print('Done')