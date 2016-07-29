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

function checksIf(fn, msg) {
    return function(value) {
        if (!fn(value)) return msg;
        return null;
    };
}
