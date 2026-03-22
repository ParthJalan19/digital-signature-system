const crypto = require('crypto');

const hashBuffer = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

module.exports = { hashBuffer };