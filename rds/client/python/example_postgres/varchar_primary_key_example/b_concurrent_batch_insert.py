import time
import psycopg2
import concurrent.futures

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
  total = 100 * 1000000
  batch_size = 100 * 1000

  thread_count = 10
  batch_count = int((total / batch_size) / thread_count)

  start_time = time.perf_counter()
  for _ in range(0, batch_count):
    with concurrent.futures.ThreadPoolExecutor(max_workers=thread_count) as executor:
      futures = [executor.submit(insertABatch, batch_size) for _ in range(0, thread_count)]

  end_time = time.perf_counter()
  print(f'Finished in {round(end_time - start_time, 2)} second(s)')

  print('Done')