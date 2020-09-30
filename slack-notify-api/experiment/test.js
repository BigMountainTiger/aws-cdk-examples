
(async () => {

  const authorizedUsersEnv = 'U0101CPEW5U,UMB8Z5A77,U016YNY18P7';
  const user = 'U0101CPEW5A';
  if (authorizedUsersEnv !== '*') {
    const authorizedUsers = authorizedUsersEnv.split(',');

    if (authorizedUsers.includes(user)) {
      console.log('In');
    } else {
      console.log('Not In');
    }
  }

  console.log('Done');
})();