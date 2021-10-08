const formatDate = (d) => {
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  let year = d.getFullYear().toString();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const createMapper = (request) => {
  const user = (request.user || {}).name;
  const r = request.request;

  return {
    projectKey: () => {
      return 'SD';
    },
    summary: () => {
      return r.summary;
    },
    description: () => {
      let description = r.description;
      let duedate = r.duedate;
      let justification = r.justification;

      if (duedate) {
        description = `${description}\n*Due date*: ${duedate}`;
      }

      if (justification) {
        description = `${description}\n*Due date justification*: ${justification}`;
      }

      description = `${description}\n*Affected application*: ${r.affected_application}`;
      description = user? `${description}\n*Slack user*: ${user}`: description;

      return description;
    },
    reporterId: () => {
      return r.jira_accountId;
    },
    assigneeId: () => {
      return null;
    },
    duedate: () => {
      if (!r.duedate) {
        return null;
      }

      return formatDate(new Date(r.duedate))
    },
    labels: () => {

      const agency = 'Agency';
      const platform = 'Platform';
      const rd = 'R&D-innovation';

      const app = r.affected_application;
      const result = [];
      if (user) {
        result.push(user);
      }
      result.push(app);

      if (app === 'DMAP') {
        result.push(platform);
      } else if (app === 'N/A') {
        result.push(rd);
      } else {
        result.push(agency);
      }

      return result;
    },
    priorityName: () => {
      if (r.priority === 'NORMAL') {
        return 'Medium';
      }
      else {
        return 'High';
      }
    },
    issuetypeName: () => {
      return r.request_type;
    }
  }
};

const map = (request) => {
  console.log(request);
  const m = createMapper(request);

  const data = {

    fields: {
      project: { key: m.projectKey() },
      summary: m.summary(),
      description: m.description(),
      reporter: {
        accountId: m.reporterId()
      },
      assignee: {
        accountId: m.assigneeId()
      },
      duedate: m.duedate(),
      labels: m.labels(),
      priority: {
        name: m.priorityName()
      },
      issuetype: { name: m.issuetypeName() }
    }
  };

  // Temporary fix, buy some time
  const user = request.user || {};
  const user_name = user.name || 'N/A';
  const user_email = user.email || 'N/A';

  const description = data.fields.description;
  data.fields.description = `${description}\n\n*Name*: ${user_name}\n*Email*: ${user_email}`;

  // Removing these fields allow the creation of the issue
  delete data.fields.reporter;
  delete data.fields.assignee;
  delete data.fields.duedate;

  console.log(data);
  return data;
}

exports.map = map;