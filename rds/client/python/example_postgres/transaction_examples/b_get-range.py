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

def batch(items):
  results = []

  with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(getRange, item) for item in items]
    
    for result in concurrent.futures.as_completed(futures):
      results.append(result.result())

  return results

if __name__ == '__main__':

  start_time = time.perf_counter()
  results = batch([100, 200, 300, 400])
  end_time = time.perf_counter()

  for r in results:
    print(f'{r} - {r[1] - r[0] + 1}') 

  print(f'Finished in {round(end_time - start_time, 2)} second(s)')


