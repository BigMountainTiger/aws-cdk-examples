import time
import psycopg2

CONSTR = 'postgres://postgres:Password123@db.bigmountaintiger.com:5432/StudentDB'

def getMax():
  conn = None

  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute('select coalesce(MAX(id), 0) from Batch_data bt')
    result = cur.fetchone()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

  return result[0]

def batchInsert(batchId, a, count):
  sql = 'insert into Batch_data (id, batch_id, item) values'
  for i in range(a, a + count):
    sql += f"({i}, {batchId}, 'A{str(i).zfill(10)}'),"
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

def createBatch():
  sql = 'insert into batch (createtime) values(now()) RETURNING id'

  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()

    result = cur.fetchone()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

  return result[0]

def insertABatch(batch_size):
  batchId = createBatch()
  a = getMax() + 1
  batchInsert(batchId, a, batch_size)

def run():
  batch_size = 100 * 1000

  start_time = time.perf_counter()
  for _ in range(0, 10 * 10):
    insertABatch(batch_size)

  end_time = time.perf_counter()
  print(f'Finished in {round(end_time - start_time, 2)} second(s)')

if __name__ == '__main__':
  run()
  print('Done')