module.exports = function () {
    var joi = require('joi');

    var validator = {
        options: { flatten: true },
        body: {
            username: joi.string().regex(/^[A-z0-9_]{3,30}$/).required(),
            password: joi.string().regex(/^\S{3,30}$/).required(),
            verifyPassword: joi.string().equal(joi.ref('password')).required(),
        },
    };
    return validator;
};
