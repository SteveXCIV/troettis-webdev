module.exports = function () {
    var joi = require('joi');

    var validator = {
        options: { flatten: true },
        query: {
            name: joi.string().required(),
        },
    };
    return validator;
};
