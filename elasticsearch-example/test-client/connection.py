from elasticsearch import Elasticsearch

url = 'https://search-huge-head-li-example-phw2qxc2j6skjqi7nv2zvud25y.us-east-1.es.amazonaws.com'
es = Elasticsearch(hosts=[f'{url}:443'], http_auth=('song', 'Passwd+123'))