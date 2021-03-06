const tagTemplate = (name, content) =>
  `\\s*\\[\\s*${name}\\s*\\]\\s*(${content})\\s*\\[\\s*\\/${name}\\s*\\]\\s*`;

const regExps = {
  name: '.*',
  allday: 'true|false',
  startDate: '[0-9]+',
  endDate: '[0-9]+',
  reminders: '\\[[0-9,\\s]*\\]',
  location: '.*',
  description: '[\\w\\W]*',
};

const full = Object.keys(regExps).map(r => {
  regExps[r] = tagTemplate(r, regExps[r]);
  return regExps[r].replace('(', '(?:');
}).join('');
const eventRegExp = tagTemplate('event', full);

const parse = text => {
  const matches = text.match(eventRegExp);
  if (!matches || !matches.length || !Array.isArray(matches)) {
    return null;
  }
  const match = matches[0];
  const results = {};
  Object.keys(regExps).forEach(r => {
    results[r] = match.match(regExps[r])[1].trim();
  });

  return {
    name: results.name,
    allday: results.allday === 'true',
    startDate: parseInt(results.startDate, 10),
    endDate: parseInt(results.endDate, 10),
    reminders: JSON.parse(results.reminders).sort((a, b) => b - a),
    location: results.location,
    description: results.description,
  };
};

const templates = {
  ...regExps,
  event: eventRegExp,
};

export {
  parse as default,
  tagTemplate,
  templates,
};
