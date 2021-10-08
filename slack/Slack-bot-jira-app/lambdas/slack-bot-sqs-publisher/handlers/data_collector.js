const standardResponses = require('./standard-responses');
const sqs = require('./sqs_queue');

const validate = (submission) => {
  const errors = [];

  const txt_summary = submission.txt_summary;
  if (!txt_summary) {
    errors.push({
      name: 'txt_summary',
      error: 'This field is required.'
    });
  } else {
    if (txt_summary.length < 10) {
      errors.push({
        name: 'txt_summary',
        error: 'You must enter at least 10 characters.'
      });
    }
  }

  const txt_description = submission.txt_description;
  if (!txt_description) {
    errors.push({
      name: 'txt_description',
      error: 'This field is required.'
    });
  }

  const txt_duedate = submission.txt_duedate;
  if (txt_duedate) {
    const date = Date.parse(txt_duedate);

    if (! date) {
      errors.push({
        name: 'txt_duedate',
        error: 'This is not a valid date.'
      });
    } else {

      const t = new Date();
      t.setHours(t.getHours() - 5);
      const time_string = `${t.getMonth() + 1}/${t.getDate()}/${t.getFullYear()}`;
      const time_stamp = Date.parse(time_string);

      console.log(`Input time: ${txt_duedate} - Begin of the day: ${time_string}`);
      console.log(`Input time: ${date} - Begin of the day: ${time_stamp}`);
      if (Math.floor(date) < Math.floor(time_stamp)) {
        errors.push({
          name: 'txt_duedate',
          error: 'You need to give a future due date.'
        });
      } else {
        const txt_justification = submission.txt_justification;

        if (!txt_justification) {
          errors.push({
            name: 'txt_justification',
            error: 'You need to give a duedate justification.'
          });
        }
      }
    }
  }

  if (errors.length === 0) {
    return null; 
  } else {
    return { errors: errors };
  }
};

const getDialogData = (input) => {
  
  const sb = input.submission;
  const user = input.user;
  
  const data = {
    type: 'DIALOG',
    user: user,
    time: Date.now(),
    request: {
      summary: sb.txt_summary,
      description: sb.txt_description,
      request_type: sb.sel_request_type,
      affected_application: sb.sel_affected_application,
      priority: sb.sel_priority,
      duedate: sb.txt_duedate,
      justification: sb.txt_justification
    }
  };

  return data;
};

const collect = async (payload) => {
  let submission = payload.submission || {};

  submission.txt_summary = (submission.txt_summary || '').trim() || null;
  submission.txt_description = (submission.txt_description || '').trim() || null;
  submission.sel_request_type = (submission.sel_request_type || '').trim() || null;
  submission.sel_affected_application = (submission.sel_affected_application || '').trim() || null;
  submission.sel_priority = (submission.sel_priority || '').trim() || null;
  submission.txt_duedate = (submission.txt_duedate || '').trim() || null;
  submission.txt_justification = (submission.txt_justification || '').trim() || null;

  let validationErrors = validate(submission);
  if (validationErrors) { return standardResponses.SUCCESSOBJECTRESPONSE(validationErrors); }

  const dialogData =  getDialogData({submission: submission, user: payload.user});
  console.log(dialogData);
  try {
    await sqs.sendData(dialogData);
  } catch(e) {
    console.error('Unable to send dialog data to the queue');
  }
  
  return standardResponses.EMPTY;
};

exports.collect = collect;
