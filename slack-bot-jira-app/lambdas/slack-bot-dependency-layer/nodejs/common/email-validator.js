const TOP_DOMAINS = 'com|org|net|int|edu|gov|mil';

const validate_email = (email) => {
  const rx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return rx.test(email);
};

const validate_domain = (email) => {
  const rx = new RegExp(`\.(${TOP_DOMAINS})$`, `i`);
  return rx.test(email);
}

exports.TOP_DOMAINS = TOP_DOMAINS;
exports.validate_email = validate_email;
exports.validate_domain = validate_domain;

