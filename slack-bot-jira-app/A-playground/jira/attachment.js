// Why it is so complicated?
// https://jira.atlassian.com/browse/JSDSERVER-43

// API document
// https://developer.atlassian.com/cloud/jira/service-desk/rest/#desks

// https://developer.atlassian.com/cloud/jira/service-desk/rest/#api-rest-servicedeskapi-servicedesk-serviceDeskId-get

// https://mlg-playground.atlassian.net/rest/servicedeskapi/servicedesk/GSD/attachTemporaryFile

// JIRA_AUTH_EMAIL=song@monsterlg.com
// JIRA_AUTH_TOKEN=8zQVXDbI8B6k5yQTRE0K764C


// {"temporaryAttachments":[{"temporaryAttachmentId":"202ca415-7097-40b9-b580-94d55c3c5889","fileName":"A-1.jpg"}]}



// https://mlg-playground.atlassian.net/rest/servicedeskapi/request/GSD-258/attachment

// {
//   "temporaryAttachmentIds": [
// 		"fb7aaacc-72d2-4b3b-91cc-d3697395e7d6"
//   ],
//   "public": true,
//   "additionalComment": {
//     "body": "Attachment\n!aws-vpc.jpg|align=right, vspace=4!"
//   }
// }


// Jira has difficulty to deal with file name duplications
// {
//   "temporaryAttachmentIds": [
// 		"050251d9-8af5-44d3-9153-8faca3a2e863"
//   ],
//   "public": true,
//   "additionalComment": {
//     "body": "[^A-shedule-cron-task.sql]"
//   }
// }

// CREATE COMMENT
// https://mlg-playground.atlassian.net/rest/servicedeskapi/request/GSD-258/comment

// {
//   "public": true,
//   "body": "!aws-vpc.jpg!"
// }

// GET COMMENT
// https://mlg-playground.atlassian.net/rest/servicedeskapi/request/GSD-258/comment/10119

// ALL Comments
// https://mlg-playground.atlassian.net/rest/servicedeskapi/request/GSD-258/comment



