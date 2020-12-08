import os
import re
import datetime
from docx import Document
import json
import util

import testdata

def merge():
  result_directory = '/tmp/'
  fileName = 'result'
  result_word_file = f'{result_directory}{fileName}.docx'
  result_pdf_file = f'{result_directory}{fileName}.pdf'
  template = '/tmp/invoicetemplate.docx'
  bucket = 'logs.huge.head.li'
  replacement = os.environ.get('REPLACEMENT', r'Paul Kempa')

  data = testdata.get_test_data()
  # Experimenting the environment variable
  json_data = os.environ.get('JSONDATA')
  print(json_data)

  # Clear the result directory
  # util.clearDirectory(result_directory)

  util.downloadtemplate()
  # Create the new word document
  wdoc = Document(template)

  util.docx_replace(wdoc, re.compile(r'{{customer-name}}') , replacement)
  util.docx_replace(wdoc, re.compile(r'{{company-name}}') , 'Baltimore Steel Factory')
  util.docx_replace(wdoc, re.compile(r'{{invoice-date}}') , datetime.date.today().strftime(r'%m/%d/%Y'))
  util.docx_fill_data(wdoc, data)

  wdoc.save(result_word_file)

  # Convert to PDF
  util.doc2pdf(result_word_file, result_pdf_file)

  # Upload to S3
  util.upload2s3(bucket, result_pdf_file)

  print('Completed')

if __name__ == '__main__':
  merge()