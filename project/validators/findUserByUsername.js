module.exports = function () {
    var joi = require('joi');

    var validator = {
        options: { flatten: true },
        query: {
            username: joi.string().required(),
        },
    };
    return validator;
};
