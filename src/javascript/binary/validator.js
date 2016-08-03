function replaceError(fn, err) {
    return function(value) {
        return fn(value).fmap(function() {
            return err;
        });
    };
}


function mapTo(ctx) {
    return function(msg) {
        return {
            ctx: ctx,
            err: msg,
        };
    };
}

/**
 * Validates data given a schema.
 *
 * @param data    An object.
 * @param schema  An object in the form {key: Array}, where the Array
 *                contains functions which return either a dv.ok or dv.fail.
 * @returns {Object}  {errors: errors, values: values} where
 *                    errors is an array of {ctx: key, err: message} objects,
 *                    and values is an object with the collected successful
 *                    values.
 */
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

/**
 * Helper for enabling form validation when the user starts and
 * stops typing.
 *
 * @param form             A form Element (not JQuery object).
 * @param config           Configuration object.
 * @param config.getState  Returns the current data on the form.
 * @param config.checker   Receives the current data and returns an array of errors.
 *                         Array will be filtered for only elements which the user
 *                         has interacted with.
 * @param config.stop      Called when the user stops typing with the errors array.
 */
function bind_validation(form, config) {
    var getState = config.getState;
    var checker  = config.checker;
    var stop     = config.stop;
    var seen     = {};

    function onStart(ev) {
        seen[stripTrailing(ev.target.name)] = true;
    }

    function onStop(ev) {
        var ctx = stripTrailing(ev.target.name);
        var data = getState();
        var errors = checker(data);
        errors = errors.filter(function(err) {
            return seen[err.ctx];
        });
        stop(errors);
    }

    form.addEventListener('change', function(ev) {
        onStart(ev);
        onStop(ev);
    });
    done_typing(form, {
        start: onStart,
        stop:  onStop,
    });
}
