import io
import re
import datetime
from docx import Document
import util

import testdata

def merge():
  replacement = r'Paul Kempa'

  data = testdata.get_test_data()
  wdoc = Document('/var/task/invoice-template')

  util.docx_replace(wdoc, re.compile(r'{{customer-name}}') , replacement)
  util.docx_replace(wdoc, re.compile(r'{{company-name}}') , r'Baltimore Steel Factory')
  util.docx_replace(wdoc, re.compile(r'{{invoice-date}}') , datetime.date.today().strftime(r'%m/%d/%Y'))
  util.docx_fill_data(wdoc, data)

  stream = io.BytesIO()
  wdoc.save(stream)

  stream.seek(0)
  return stream