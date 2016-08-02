function mapTo(ctx) {
    return function(msg) {
        return {
            ctx: ctx,
            err: msg,
        };
    };
}

function validate_object(data, schema) {
    var keys = Object.keys(schema);
    var values = {};
    var rv = dv.combine([], keys.map(function(ctx) {
        var res = dv.first(data[ctx], schema[ctx]);
        if (res.isOk) {
            values[ctx] = res.value;
        }
        return res.fmap(mapTo(ctx));
    }));
    return {
        errors: rv.value,
        values: values,
    };
}


function stripTrailing(name) {
    return name.replace(/\[\]$/, '');
}

function bind_validation(form, config) {
    var getState = config.getState;
    var checker  = config.checker;
    var stop     = config.stop;

    var seen = {};

    function beforeTyping(ev) {
        seen[stripTrailing(ev.target.name)] = true;
    }

    function afterTyping(ev) {
        var ctx = stripTrailing(ev.target.name);
        var data = getState();
        var info = checker(data);
        info.errors = info.errors.filter(function(err) {
            return seen[err.ctx];
        });
        stop(info, data);
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
