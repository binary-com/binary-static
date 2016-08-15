var ValidationUI = {
    clear: function() {
        $('.errorfield[data-is-error-field]').remove();
    },
    draw:  function(selector, message) {
        var $parent = $(selector).parent();
        var $p = $('<p/>', {
            class: 'errorfield',
            text:  text.localize(message),
        });
        $p.attr('data-is-error-field', true);
        $parent.append($p);
    },
};


/**
 * Replaces error messages returned by a validator by the given
 * error message `err`. Only use this on validators with one
 * error message.
 */
function customError(fn, err) {
    return function(value) {
        var rv = fn(value);
        if (!rv.isOk) rv.value = [err];
        return rv;
    };
}


function withContext(ctx) {
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
 *                contains functions which accept two arguments- the current
 *                value and the objet being validated, and return either dv.ok
 *                or dv.fail.
 * @returns {Object}  {errors: errors, values: values, raw: data} where
 *                    errors is an array of {ctx: key, err: message} objects,
 *                    values is an object with the collected successful values,
 *                    raw is the data passed in.
 */
function validate_object(data, schema) {
    var keys = Object.keys(schema);
    var values = {};
    var rv = dv.combine([], keys.map(function(ctx) {
        var res = dv.ok(data[ctx]);
        var fns = schema[ctx];
        for (var i = 0; i < fns.length; i++) {
            res = fns[i](res.value, data);
            if (!res.isOk) return res.fmap(withContext(ctx));
        }
        values[ctx] = res.value;
        return res;
    }));
    return {
        errors: rv.value,
        values: values,
        raw:    data,
    };
}


function stripTrailing(name) {
    return name.replace(/\[\]$/, '');
}

/**
 * Helper for enabling form validation when the user starts and stops typing.
 *
 * @param form             A form Element (not JQuery object).
 * @param config           Configuration object.
 * @param config.extract   Returns the current data on the form.
 * @param config.validate  Receives the current data returns an object with
 *                         {values: Object, errors: [{ctx: key, err: msg}...]}.
 * @param config.stop      Called when the user stops typing with the return
 *                         value of `config.validate`.
 * @param config.submit    Called on submit event with event and validation state.
 */
function bind_validation(form, config) {
    var extract  = config.extract;
    var validate = config.validate;
    var stop     = config.stop;
    var submit   = config.submit;
    var seen     = {};

    function onStart(ev) {
        seen[stripTrailing(ev.target.name)] = true;
    }

    function onStop(ev) {
        var data = extract();
        var validation = validate(data);
        validation.errors = validation.errors.filter(function(err) {
            return seen[err.ctx];
        });
        stop(validation);
    }

    form.addEventListener('submit', function(ev) {
        var data = extract();
        var validation = validate(data);
        stop(validation);
        submit(ev, validation);
    });

    form.addEventListener('change', function(ev) {
        onStart(ev);
        onStop(ev);
    });
    done_typing(form, {
        start: onStart,
        stop:  onStop,
    });
}

/**
 * Generates (and binds) a config for the given form.
 *
 * @param form  Form element.
 * @param opts  Config object.
 * @param opts.extract   Optional. Defaults to `formToObj(form)`.
 * @param opts.submit    Required.
 * @param opts.validate  Optional. If you do not specify this then opts.schema
 *                       is required.
 * @param opts.schema    See above.
 * @param opts.stop      Optional.
 *
 */
bind_validation.simple = function(form, opts) {
    bind_validation(form, {
        submit:   opts.submit,
        extract:  opts.extract  || function() { return formToObj(form); },
        validate: opts.validate || function(data) { return validate_object(data, opts.schema); },
        stop:     opts.stop     || function(validation) {
            ValidationUI.clear();
            validation.errors.forEach(function(err) {
                var sel = 'input[name=' + stripTrailing(err.ctx) + ']';
                ValidationUI.draw(sel, err.err);
            });
        },
    });
};
