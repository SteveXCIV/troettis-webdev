module.exports = function () {
    var api = {
        convertDbError: convertDbError
    };
    return api;

    function convertDbError(dbError) {
        var errors = [];
        if (dbError.errors) {
            for (var key in dbError.errors) {
                errors.push(dbError.errors[key].message);
            }
        }
        return errors;
    }
};
