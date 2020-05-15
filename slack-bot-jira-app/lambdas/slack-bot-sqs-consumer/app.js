require('dotenv').config();

const jiraCreationHandler = require('./handlers/jira-creation-handler');
const jiraAttachmentHandler = require('./handlers/jira-attachment-handler');
const slack = require('./handlers/slack-informer');

const getRequests = (event) => {
  let requests = [];

  try {
    
    for ( const {body} of (event.Records || [])) {
      requests.push(JSON.parse(body));
    }
  } catch(e) {
    console.error('Unable to parse the SQS event\n' + JSON.stringify(event));
    requests = [];
  }

  return requests;
};

const processRequests = async (event) => {
  const requests = getRequests(event);
  
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    const user = request.user;

    if ((!user) || !(user.id)) {
      continue;
    }

    let msgText = 'Unknow Request';
    if (request.type === 'DIALOG') {
      msgText = await jiraCreationHandler.create(request);
    }
    
    if (request.type === 'ATTACHMENT') {
      msgText = await jiraAttachmentHandler.attach(request);
    }
    
    const msg = {
      channel: user.id,
      text: msgText
    };
    try {
      await slack.inform(msg);
    } catch(e) {
      console.error('Unable to send the message to slack\n' + JSON.stringify(msg));
    }
  
  }
};

exports.lambdaHandler = async (event, context) => {
  if (event.Is_QA_Environmental_Validation) {
    return require('./qa-general/qa-environmental-validation').validate();
  }

  try {
    await processRequests(event);
  }
  catch(e) {
    console.error('LAST defense -  error\n' + JSON.stringify(e));
  }

  return {};
};