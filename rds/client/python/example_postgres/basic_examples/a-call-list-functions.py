import psycopg2
from pprint import pprint

CONSTR = 'postgres://postgres:Password123@postgres.bigmountaintiger.com:5432/ExperimentDB'

def connect():

  conn = None

  sql_get_students = 'select * from public.get_students()'
  sql_get_a_student = 'select * from public.get_a_student((%s))'
  sql_get_a_student_by_name = 'select * from public.get_a_student_by_name((%s))'

  try:

    conn = psycopg2.connect(CONSTR)

    cur = conn.cursor()
    cur.execute(sql_get_students)
    rows_get_students = cur.fetchall()
    print(rows_get_students)
    cur.close()

    cur = conn.cursor()
    cur.execute(sql_get_a_student, (1,))
    rows_get_a_student = cur.fetchall()
    print(rows_get_a_student)
    cur.close()

    cur = conn.cursor()
    cur.execute(sql_get_a_student_by_name, ('Song Li - 3',))
    rows_get_a_student_by_name = cur.fetchall()
    print(rows_get_a_student_by_name)
    cur.close()

  except (Exception) as error:
    print(error)

  finally:
    if conn is not None:
      conn.close()

if __name__ == '__main__':
  connect()
  print('Done')