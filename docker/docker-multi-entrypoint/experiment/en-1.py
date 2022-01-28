import os

def run():
  print(f'This is {os.path.basename(__file__)}')
  print(f'The environ = {os.environ["pythonentry"]}')

if __name__ == '__main__':
  run()