import io
import re
import datetime
from docx import Document
import util

def merge(data):

  contact = data['contact']
  invoice = data['invoice']

  wdoc = Document('/var/task/invoicetemplate.docx')

  util.docx_replace(wdoc, re.compile(r'{{customer-name}}') , contact['name'])
  util.docx_replace(wdoc, re.compile(r'{{company-name}}') , contact['company'])
  util.docx_replace(wdoc, re.compile(r'{{invoice-date}}') , datetime.date.today().strftime(r'%m/%d/%Y'))
  util.docx_fill_data(wdoc, invoice)

  wdoc.save('/tmp/result.docx')
