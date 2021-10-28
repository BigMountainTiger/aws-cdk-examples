import time
import psycopg2

CONSTR = 'postgres://postgres:Password123@db.bigmountaintiger.com:5432/StudentDB'

def insertABatch(batch_size):
  conn = None

  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute('select * from insert_range(%s)', [batch_size])
    conn.commit()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

def run():
  batch_size = 100 * 1000

  start_time = time.perf_counter()
  for _ in range(0, 100 * 10):
    insertABatch(batch_size)

  end_time = time.perf_counter()
  print(f'Finished in {round(end_time - start_time, 2)} second(s)')

if __name__ == '__main__':
  run()
  print('Done')