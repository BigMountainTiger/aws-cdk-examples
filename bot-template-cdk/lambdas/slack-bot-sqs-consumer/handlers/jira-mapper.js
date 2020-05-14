const formatDate = (d) => {
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  let year = d.getFullYear().toString();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const createMapper = (request) => {
  const user = request.user.name;
  const r = request.request;

  return {
    projectKey: () => {
      return 'GSD';
    },
    summary: () => {
      return r.summary;
    },
    description: () => {
      let description = r.description;
      let justification = r.justification;

      if (justification) {
        description = `${description}\n*Due date justification*: ${justification}`;
      }

      description = `${description}\n*Affected application*: ${r.affected_application}`;
      description = `${description}\n*Slack user*: ${user}`;

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
      const result = [user, app];

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

exports.createMapper = createMapper;