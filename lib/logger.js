module.exports = function (options) {
    /*
    *   Consts
    */
    const DEVELOP =         1;
    const RELEASE =         0;
    const DEBUG =           3;
    const INFO =            2;
    const WARN =            1;
    const ERROR =           0;
    const DEBUG_PREFIX =    '[DEBUG]';
    const INFO_PREFIX =     '[INFO]';
    const WARN_PREFIX =     '[WARN]';
    const ERROR_PREFIX =    '[ERROR]';

    var _opts = null;

    /*
    *   Exports
    */
    var api = {
        debug: debug,
        info: info,
        warn: warn,
        error: error,
    };
    if (!_opts) {
        _getOpts();
    }
    return api;

    /*
    *   Private Scope
    */
    function _getFilters(_filters) {
        console.log(_developLevelFilter);
        filters = {
            develop: (_filters) ? (_filters.develop || _developLevelFilter) : _developLevelFilter,
            release: (_filters) ? (_filters.release || _releaseLevelFilter) : _releaseLevelFilter,
        };
        return filters;
    }

    function _getOpts() {
        var _def = {
            levelFilters: {
                develop:    _developLevelFilter,
                release:    _releaseLevelFilter,
            },
            mode:           DEVELOP,
            debug:          DEBUG_PREFIX,
            info:           INFO_PREFIX,
            warn:           WARN_PREFIX,
            error:          ERROR_PREFIX,
            writer:         console.log,
        };

        if (options)
        {
            _opts = {
                levelFilters: _getFilters(options.levelFilters),
                mode: _getValueFrom(options.mode) || _def.mode,
                debug: _getValueFrom(options.debug) || _def.debug,
                info: _getValueFrom(options.info) || _def.info,
                warn: _getValueFrom(options.warn) || _def.warn,
                error: _getValueFrom(options.error) || _def.error,
                writer: options.writer || console.log,
            };
        } else {
            _opts = _def;
        }
    }

    function _getPrefix(_level) {
        switch (_level) {
            case DEBUG:
                return _getValueFrom(_opts.debug);
            case INFO:
                return _getValueFrom(_opts.info);
            case WARN:
                return _getValueFrom(_opts.warn);
            case ERROR:
                return _getValueFrom(_opts.error);
            default:
                throw new SyntaxError('Invalid log level.');
        }
    }

    function _writeLog(_mode, _level, _message) {
        var filterFunc = (_mode == DEVELOP) ? _opts.levelFilters.develop : _opts.levelFilters.release;

        if (filterFunc(_level)) {
            var _m = `${_getPrefix(_level)}:: ${_message}`;
            _opts.writer(_m);
        }
    }

    function _developLevelFilter(_l) {
        return true;
    }

    function _releaseLevelFilter(_l) {
        return l <= ERROR;
    }

    function _isFunc(_f){
        return (typeof(_f) === 'function');
    }

    function _getValueFrom(_v) {
        return _isFunc(_v) ? _v() : _v;
    }

    /*
    *   Public Scope
    */
    function debug(message) {
        _writeLog(_opts.mode, DEBUG, message);
    }

    function info(message) {
        _writeLog(_opts.mode, INFO, message);
    }

    function warn(message) {
        _writeLog(_opts.mode, WARN, message);
    }

    function error(message, err = null) {
        if (err) {
            message += `Error: ${JSON.stringify(err)}`;
        }
        _writeLog(_opts.mode, ERROR, message);
    }


};
