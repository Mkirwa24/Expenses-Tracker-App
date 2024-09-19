const crypto = require('crypto');

const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

const tokenExpiry = () => {
    const expiryTime = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    return expiryTime;
};

module.exports = {generateResetToken, tokenExpiry};