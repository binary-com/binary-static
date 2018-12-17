const colors = require('../config/constants').colors;

const prompt = (message, type) => (`echo "${colors[type || 'info']}>>${colors.reset} ${message}"`);

module.exports = {
    prompt,
};
