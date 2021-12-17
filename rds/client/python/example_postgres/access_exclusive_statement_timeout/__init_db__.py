import db

def run():
  statements = []

  statements.append('DROP table if exists public.a_table')
  statements.append('CREATE TABLE public.a_table (id varchar NULL)')

  db.execute(";".join(statements))


if __name__ == '__main__':
  run()