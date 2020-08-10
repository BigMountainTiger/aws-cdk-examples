const sqs = require('./sqs_queue');

const getAttachmentData = (e) => {
  const files = [];
  for (let i = 0; i < e.files.length; i++) {
    let file = e.files[i];

    files.push({
      name: file.name,
      size: file.size,
      url_private: file.url_private,
      url_private_download: file.url_private_download
    });
  }

  let data = {
    type: 'ATTACHMENT',
    user: { id: e.user },
    jiraId: e.text,
    files: files
  };

  return data;
};

const sendAttachmentData = async (event) => {
  const attachmentData = getAttachmentData(event);
  console.log(attachmentData)
  try {
    await sqs.sendData(attachmentData);
  }catch(e) {
    
    console.error('Unable to send dialog data to the queue');
  }
};

exports.sendAttachmentData = sendAttachmentData;