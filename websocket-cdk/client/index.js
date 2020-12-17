// https://www.npmjs.com/package/browser-refresh

const express = require('express'),
  http = require('http'),
  path = require('path'),
  errorhandler = require('errorhandler');
    
const app = express();
    
app.set('port', 3000);
    
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.use(express.static(path.join(__dirname, 'static')));
app.use(errorhandler());

app.get('/refresh-script', (req, res) => {
  const refresh_script = process.env.BROWSER_REFRESH_URL || ''
  res.send(refresh_script);
});
    
http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);

  if (process.send) {
    process.send({ event:'online', url:`http://localhost:${app.get('port')}/` });

    console.log(process.env.BROWSER_REFRESH_URL);
  }
});