const express = require('express'),
  http = require('http'),
  path = require('path'),
  errorhandler = require('errorhandler');
    
const app = express();
    
app.set('port', 3000);
    
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});
    
app.use(express.static(path.join(__dirname, 'static')));
    
app.use(errorhandler());
    
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});