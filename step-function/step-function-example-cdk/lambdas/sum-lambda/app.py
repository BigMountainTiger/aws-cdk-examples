def lambda_handler(event, context):
  
  x = event['x']
  y = event['y']

  s = x + y

  return {
    'Payload': {
      'sum': s
    } 
  }