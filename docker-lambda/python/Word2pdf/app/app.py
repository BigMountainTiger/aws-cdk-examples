import sys

sys.path.append('/app')

from word_pdf import merge

def lambdaHandler(event, context):
    merge()
    return f'{event} is received'