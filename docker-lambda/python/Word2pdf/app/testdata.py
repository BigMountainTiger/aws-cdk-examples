def get_test_data():
  items = [
    {
      'quantity': 12,
      'description': 'Item description No.0',
      'unitprice': 12000.3,
      'linetotal': 20
    }
  ]

  for x in range(50):
    items.append({
      'quantity': 1290,
      'description': f'Item description No.{x}',
      'unitprice': 12.3,
      'linetotal': 20000
    })

  return {
    'items': items,
    'total': 50000000.01
  }