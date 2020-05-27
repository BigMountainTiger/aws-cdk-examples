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

exports.issue = async (query) => {
  const cn = sf.createConnection( {
    account: 'gja08302.us-east-1',
    username: 'song_li',
    password: 'Password-123',
    database: 'MLG_SNOWFLAKE',
    schema: 'public',
    warehouse: 'COMPUTE_WH'
  });

  await establishConnection(cn);
  await issueQuery(cn, query);
  await destroyConnection(cn);
  
};
