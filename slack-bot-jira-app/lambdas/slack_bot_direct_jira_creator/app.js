// https://stackoverflow.com/questions/4083702/posting-a-file-and-associated-data-to-a-restful-webservice-preferably-as-json
require('dotenv').config({ path: '/opt/nodejs/common/.env'});

const HTTPResponse = require('./HTTPResponse');
const jiraCreationHandler = require('./handlers/jira-creation-handler');
const jiraAttachmentHandler = require('./handlers/jira-attachment-handler');

exports.lambdaHandler = async (event, context) => {
  const ATTACH_RESOURCE = '/service-desk/attach/{key}/{filename}';
  const CREATE_RESOURCE = '/service-desk/create';
  const resource = event.resource;
  
  let response = HTTPResponse.NotImplemented();
  if (resource === CREATE_RESOURCE) {
    console.log(event.body);
    response = await jiraCreationHandler.create(event.body);
  }
  else if (resource === ATTACH_RESOURCE) {
    const key = event.pathParameters.key;
    const file = {
      name: event.pathParameters.filename,
      body: (event.body || '').trim()
    };
    
    console.log({key: key, filename: file.name, size: (file.body || '').length})
    response = await jiraAttachmentHandler.attach({key: key, file: file});
  }

  console.log(response);
  response.headers = { "Access-Control-Allow-Origin": "*", "content-type": "application/json" };

  return response;
};