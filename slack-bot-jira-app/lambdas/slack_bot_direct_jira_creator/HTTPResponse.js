module.exports = {
  OK: (v) => { v = v || 'OK'; return { statusCode: 200, body: v}; },
  NotImplemented: (v) => { v = v || 'Not Implemented'; return { statusCode: 501, body: v}; },
  BadRequest: (v) => { v = v || 'Bad Request'; return { statusCode: 400, body: v}; },
  InternalServerError: (v) => { v = v || 'Internal Server Error'; return { statusCode: 500, body: v}; }
};