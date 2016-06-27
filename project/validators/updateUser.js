module.exports = function () {
    var joi = require('joi');

    var validator = {
        options: { flatten: true },
        body: {
            password: joi.string().regex(/^\S{3,30}$/).required(),
            newPassword: joi.string().regex(/^\S{3,30}$/),
            verifyNewPassword: joi.string().equal(joi.ref('newPassword')),
        },
    };
    return validator;
};
