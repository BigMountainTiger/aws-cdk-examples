const sf = require('snowflake-sdk');

const establishConnection = (cn) => {

  return new Promise((rs, rj) => {
    cn.connect((err, cn) => { if (err) { rj(err); } else { rs(cn); } })
  });
};

const issueQuery = (cn, query) => {

  return new Promise((rs, rj) => {
    cn.execute({ sqlText: query, complete: (err, stmt) => {
      if (err) { rj(err) } else { rs(`Successfully executed statement:\n ${stmt.getSqlText()}`); }
    }});
  });
};

const destroyConnection = (cn) => {
  return new Promise((rs, rj) => {
    cn.destroy((err, cn) => {
      if (err) { rj(err); } else { rs('Disconnected connection with id: ' + cn.getId()); }
    })
  });
};

exports.issue = async (queries) => {
  const cn = sf.createConnection( {
    account: 'gja08302.us-east-1',
    username: 'USER_NAME',
    password: 'USER_PASSWORD',
    database: 'DATABASE_NAME',
    schema: 'public',
    warehouse: 'COMPUTE_WH'
  });

  try {
    await establishConnection(cn);

    for (let i = 0; i < queries.length; i++) {
      await issueQuery(cn, queries[i]);
    }
  }
  finally {
    if (cn.isUp()) {
      await destroyConnection(cn);
    }
  }
};
