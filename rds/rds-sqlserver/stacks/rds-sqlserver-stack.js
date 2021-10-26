const cdk = require('@aws-cdk/core');
const db = require('./resources/db');

class RdsSqlserverStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    db.createDB(this, id, props);
  }
}

module.exports = { RdsSqlserverStack }
