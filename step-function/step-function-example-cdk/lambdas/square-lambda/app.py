def lambda_handler(event, context):
  
  sum = event['sum']

  return {
    'Payload': {
      'result': sum * sum
    } 
  }