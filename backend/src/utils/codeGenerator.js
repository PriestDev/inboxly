const crypto = require('crypto');

const generateWidgetCode = async (length = 8) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(length);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
};

module.exports = {
  generateWidgetCode
};