require('dotenv').config();

const qs = require('qs');
const standardResponses = require('./handlers/standard-responses');
const dialogLauncher = require('./handlers/dialog_launcher');
const dataCollector = require('./handlers/data_collector');
const attachment = require('./handlers/attachment_collector');
const BOT_USER_ID = process.env.BOT_USER_ID;

const eventTypes = {
  events: 'events',
  commands: 'commands'
};

const parseBody = event => {
  let body = null;
  try {

    body = JSON.parse(event.body);
    body.eventTypes = eventTypes.events;
  } catch(err) {

    body = qs.parse(event.body);
    body.eventTypes = eventTypes.commands;
  }

  return body;
};

exports.lambdaHandler = async (event, context) => {
  let body = parseBody(event);

  if (body.eventTypes === eventTypes.events) {
    if (body.type === 'url_verification') {
      return {
        statusCode: 200, body: JSON.stringify(body)
      };
    }

    const eventData = body.event;
    if (eventData) {
      let files = eventData.files || [];
      if ((eventData.user !== BOT_USER_ID) && (eventData.upload) && (files.length > 0)) {
        await attachment.sendAttachmentData(eventData);
      }
    }

    return standardResponses.EMPTY;
  }

  if (body.eventTypes === eventTypes.commands) {
    let payload = JSON.parse(body.payload || '{}');
    if (payload.type === 'dialog_submission') {
      return await dataCollector.collect(payload);
    }

    let trigger_id = body.trigger_id;
    if (trigger_id) {
      return await dialogLauncher.launch(trigger_id);
    }
  }

  return standardResponses.UNSUPPORTED;
};