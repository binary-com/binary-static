function mapTo(ctx) {
    return function(err) {
        return {
            ctx: ctx,
            err: err,
        };
    };
}

function validate_object(data, schema) {
    var keys = Object.keys(schema);
    // TODO: collect values here as well, so we don't
    // have to do parsing again.
    var rv = dv.combine([], keys.map(function(ctx) {
        return dv.first(data[ctx], schema[ctx]).fmap(mapTo(ctx));
    }));
    return rv.value;
}


function stripTrailing(name) {
    return name.replace(/\[\]$/, '');
}

function bind_validation(form, config) {
    var getState = config.getState;
    var checker  = config.checker;
    var start    = config.start;
    var stop     = config.stop;

    var seen = {};

    function beforeTyping(ev) {
        start();
        seen[stripTrailing(ev.target.name)] = true;
    }

    function afterTyping(ev) {
        var ctx = stripTrailing(ev.target.name);
        var data = getState();
        var errors = checker(data);
        errors = errors.filter(function(err) {
            return seen[err.ctx];
        });
        stop(errors.length ? errors : null, data);
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
