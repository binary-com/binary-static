function simple_validator(fields) {
    var keys = Object.keys(fields);
    return function(data) {
        var errors = [];
        keys.forEach(function(ctx) {
            var fns = fields[ctx];
            for (var i = 0; i < fns.length; i++) {
                var error = fns[i](data[ctx], data);
                if (error === null) continue;
                errors.push({
                    ctx: ctx,
                    err: error,
                });
                break;
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

function startStopTyping(elem, started, stopped) {
    var stop;

    function keepTyping(ev) {
        if (stop)
            started(ev);
        stop = false;
    }

    function stopTyping(ev) {
        stop = true;
        stopped(ev);
    }

    elem.addEventListener('keyup', keepTyping);
    elem.addEventListener('keyup', debounce(stopTyping, 200));
}

function stripTrailing(name) {
    return name.replace(/\[\]$/, '');
}

function bindCheckerValidation(form, config) {
    var getState = config.getState;
    var checker  = config.checker;
    var before   = config.before;
    var after    = config.after;
    var state    = getState();

    var seen = {};

    function beforeTyping(ev) {
        before();
        seen[stripTrailing(ev.target.name)] = true;
    }

    function afterTyping(ev) {
        var ctx = stripTrailing(ev.target.name);
        state = getState();
        var errors = checker(state);
        errors = errors.filter(function(err) {
            return seen[err.ctx];
        });
        after(errors.length ? errors : null, state);
    }

    form.addEventListener('change', function(ev) {
        beforeTyping(ev);
        afterTyping(ev);
    });
    startStopTyping(
        form,
        beforeTyping,
        afterTyping
    );
}
