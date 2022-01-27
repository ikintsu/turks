const fernet = require('fernet');

function get_secret() {
  return new fernet.Secret('OjnueUBpgp2iTSWJS9F0nUSaypALniqBcGnXHdVhtNU=');
}

function encrypt(str) {
  return new fernet.Token({
  secret: get_secret(),
  time: Date.parse(1),
  iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
}).encode(str).toString();
}

function decrypt(encrypted) {
  return new fernet.Token({
      secret: get_secret(),
      token: encrypted,
      ttl: 0
  }).decode().toString();
}

module.exports = {
  decrypt,
  encrypt
};
