import sys
from word_pdf import merge

def lambdaHandler(event, context):
    merge()
    return f'{event} is received'