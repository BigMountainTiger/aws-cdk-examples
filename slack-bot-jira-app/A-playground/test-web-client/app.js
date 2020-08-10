const express = require('express');
const http = require('http');

const app = express();
app.set('port', process.env.PORT || 8080);

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');

  next()
})
app.use(express.static('static'))
 
http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});