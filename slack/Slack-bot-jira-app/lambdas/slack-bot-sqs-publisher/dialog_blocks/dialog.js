let getDialog = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);

  // No longer give default due date
  const duedate = date.toLocaleDateString();
  
  // https://api.slack.com/dialogs
  const dialog = {
    "callback_id": "Something-meaningfull-but-non-sensitive",
    "title": "SUBMIT A REQUEST",
    "submit_label": "Request",
    "notify_on_cancel": false,
    "state": "Limo",
    "elements": [
      {
        "type": "text",
        "label": "ISSUE SUMMARY",
        "name": "txt_summary",
        "placeholder": "Please give a summary of the issue",
        "min_length": 10,
        "optional": false
      },
      {
        "type": "textarea",
        "label": "ISSUE DESCRIPTION",
        "name": "txt_description",
        "placeholder": "Please give a description of the issue",
        "optional": false
      },
      {
        "label": "REQUEST TYPE",
        "type": "select",
        "name": "sel_request_type",
        "placeholder": "Please choose a request type",
        "options": [
          {
            "label": "Bug",
            "value": "Bug"
          },
          {
            "label": "Support",
            "value": "Support"
          },
          {
            "label": "Feature",
            "value": "Feature"
          }
        ]
      },
      {
        "label": "AFFECTED APPLICATION",
        "type": "select",
        "name": "sel_affected_application",
        "placeholder": "Please choose an affected application",
        "options": [
          {
            "label": "Accounting",
            "value": "Accounting"
          },
          {
            "label": "Admin",
            "value": "Admin"
          },
          {
            "label": "CRM",
            "value": "CRM"
          },
          {
            "label": "DMAP",
            "value": "DMAP"
          },
          {
            "label": "N/A - An improvement suggestion",
            "value": "N/A"
          }
        ]
      },
      {
        "label": "PRIORITY",
        "type": "select",
        "value": "NORMAL",
        "name": "sel_priority",
        "placeholder": "Please choose a priority",
        "options": [
          {
            "label": "NORMAL",
            "value": "NORMAL"
          },
          {
            "label": "CRITICAL",
            "value": "CRITICAL"
          }
        ]
      },
      {
        "type": "text",
        "label": "DUE DATE",
        "value": null,
        "name": "txt_duedate",
        "placeholder": "MM/DD/YYYY",
        "optional": false
      },
      {
          "type": "textarea",
          "label": "JUSTIFICATION",
          "name": "txt_justification",
          "optional": false
      },
    ]
  };

  return dialog;
}

module.exports = getDialog;