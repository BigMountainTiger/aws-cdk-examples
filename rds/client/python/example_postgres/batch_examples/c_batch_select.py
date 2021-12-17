import time
import psycopg2
import json

CONSTR = 'postgres://postgres:Password123@db.bigmountaintiger.com:5432/StudentDB'

def selectBatch(batch_id):
  sql = 'select * from batch_data where batch_id = %s'

  conn = None
  try:
    conn = psycopg2.connect(CONSTR)
    cur = conn.cursor()
    cur.execute(sql, [batch_id])

    result = cur.fetchall()
    cur.close()
  finally:
    if conn is not None:
      conn.close()

  return result

def run():
  start_time = time.perf_counter()

  result = selectBatch(399)
  json_data = json.dumps(result)

  print(len(result))
  end_time = time.perf_counter()
  print(f'Finished in {round(end_time - start_time, 2)} second(s)')

if __name__ == '__main__':
  run()
  print('Done')