const express = require('express');
const http = require('http');

const app = express();
app.set('port', process.env.PORT || 8080);

app.use(express.static('static'))
 
http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});