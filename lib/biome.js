module.exports = function () {
    var biome = {
        'get': get
    };
    return biome;

    function _context() {
        return process.env;
    }

    function _get(key) {
        var value = _context()[key];
        if (value) {
            return value;
        } else {
            throw `No value found for key "${key}".`;
        }
    }

    function get(key) {
        if (typeof(key) === 'string') {
            return _get(key);
        } else if (Array.isArray(key)) {
            var values = key.reduce(
                function (acc, x, _i) {
                    try {
                        acc.result[x] = _get(x);
                    } catch (e) {
                        acc.error.push(e);
                    } finally {
                        return acc;
                    }
                },
                {
                    result: { },
                    error: [ ],
                });

            if (values.error.length != 0) {
                throw values.error.join('\n');
            } else {
                return values.result;
            }
        } else {
            throw TypeError('Input to biome.get() must be string or Array.');
        }
    }
};
