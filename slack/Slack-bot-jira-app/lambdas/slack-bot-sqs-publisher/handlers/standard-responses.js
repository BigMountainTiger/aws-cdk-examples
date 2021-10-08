const UNSUPPORTED = {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json'
  }, body: 'UNSUPPORTED REQUEST'
};

const EMPTY = {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json'
  }, body: ''
};

const INFORMATIONRESPONSE = (text) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: text
  };
};

const SUCCESSOBJECTRESPONSE = (body) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(body)
  };
};

exports.EMPTY = EMPTY;
exports.UNSUPPORTED = UNSUPPORTED;
exports.INFORMATIONRESPONSE = INFORMATIONRESPONSE;
exports.SUCCESSOBJECTRESPONSE = SUCCESSOBJECTRESPONSE;
