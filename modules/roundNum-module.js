'use strict';

module.exports = function roundNum(num, digits) {
    return +(Math.round(num + 'e+'+digits)  + 'e-'+digits);
};
