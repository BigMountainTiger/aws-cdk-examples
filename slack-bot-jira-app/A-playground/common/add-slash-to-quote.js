const text = `{"type":"DIALOG","user":{"id":"U01023BN1MX","name":"da_tou_li"},"time":1587001769306,"request":{"summary":"A Triage request","description":"This request should go to the triage queue automatically","request_type":"Support","affected_application":"N/A","priority":"NORMAL","duedate":"1/23/2021","justification":"It is a long due-date."}}`;

console.log(text.split('"').join('\\"'));
