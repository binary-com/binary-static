function mapTo(ctx) {
    return function(err) {
        return {
            ctx: ctx,
            err: err,
        };
    };
}

function simple_validator(fields) {
    var keys = Object.keys(fields);
    return function(data) {
        var rv = dv.combine([], keys.map(function(key) {
            var fns = fields[key];
            return dv.first(data[key], fns).fmap(mapTo(key));
        }));
        return rv.value;
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
