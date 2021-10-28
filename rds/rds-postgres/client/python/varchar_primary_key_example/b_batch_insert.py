import time
import psycopg2

CONSTR = 'postgres://postgres:Password123@db.bigmountaintiger.com:5432/StudentDB'

def getRange(count):

  sql = 'select * from public.get_range((%s))'
  conn = None
  items = None

  try:
    conn = psycopg2.connect(CONSTR)

    cur = conn.cursor()
    cur.execute(sql, [count])
    conn.commit()

    items = cur.fetchone()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

  return items

def insertABatch(batch_size):

  (a, b) = getRange(batch_size)
  
  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute('select * from insert_range(%s, %s)', [a, b])
    conn.commit()
    cur.close()
  finally:
    if conn is not None:
      conn.close()


if __name__ == '__main__':
  loop_count = 50 * 10
  batch_size = 100 * 1000

  start_time = time.perf_counter()
  for _ in range(0, loop_count):
    insertABatch(batch_size)

  end_time = time.perf_counter()
  print(f'Finished in {round(end_time - start_time, 2)} second(s)')

  print('Done')