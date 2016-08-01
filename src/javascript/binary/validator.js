function simple_validator(fields) {
    var keys = Object.keys(fields);
    return function(data) {
        var errors = [];
        keys.forEach(function(ctx) {
            var fns = fields[ctx];
            for (var i = 0; i < fns.length; i++) {
                var error = fns[i](data[ctx], data);
                if (error === null) continue;
                return errors.push({
                    ctx: ctx,
                    err: error,
                });
            }
        });
        return errors;
    };
}

function checkIf(fn, msg) {
    return function(value) {
        if (!fn(value)) return msg;
        return null;
    };
}

function stripTrailing(name) {
    return name.replace(/\[\]$/, '');
}

function bindCheckerValidation(form, config) {
    var getState = config.getState;
    var checker  = config.checker;
    var start    = config.start;
    var stop     = config.stop;
    var state    = getState();

    var seen = {};

    function beforeTyping(ev) {
        start();
        seen[stripTrailing(ev.target.name)] = true;
    }

    function afterTyping(ev) {
        var ctx = stripTrailing(ev.target.name);
        state = getState();
        var errors = checker(state);
        errors = errors.filter(function(err) {
            return seen[err.ctx];
        });
        stop(errors.length ? errors : null, state);
    }

    form.addEventListener('change', function(ev) {
        beforeTyping(ev);
        afterTyping(ev);
    });
    done_typing(form, {
        start: beforeTyping,
        stop:  afterTyping,
    });
}
