forms = (function() {
    var registered = {};

    function parseDeclaration(decl) {
        decl = decl.trim();
        if (!decl) return [];
        return decl.split(/ +/).map(function(str) {
            var splat = str.split(':');
            return {
                name: splat[0],
                args: splat.slice(1),
            };
        });
    }

    function parseInput(input) {
        return parseDeclaration($(input).attr('data-form') || '');
    }

    function getErrors(input, infos) {
        for (var i = 0; i < infos.length; i++) {
            var info  = infos[i];
            var guard = registered[info.name];
            var args  = [input.value].concat(info.args);
            if (!guard.apply(input, args)) {
                return {name: info.name, args: args};
            }
        }
        return null;
    }

    function Form(form, config) {
        this.$form = $(form);
        this.config = $.extend({
            displayError: function(elem, message) {
                console.log(elem, message);
            },
            before: function() {},
            errors: {},
        }, config);
        this.bind();
    }

    Form.prototype = {
        bind: function() {
            var self = this;
            this.$form.find('input').each(function() {
            var parsed  = parseInput(this);
            var handler = debounce(function() {
                self.validate(this, parsed);
            }, 50);
            $(this).on('change', handler)
                   .on('input',  handler);
            });
        },

        validate: function(input, infos) {
            this.config.before(input);
            var err = getErrors(input, infos);
            if (!err) {
                return true;
            }
            var formatter = this.config.errors[err.name];
            var msg = formatter.apply(input, err.args);
            this.config.displayError(input, msg);
            return false;
        },

        valid: function() {
            var self = this;
            var valid = true;
            this.$form.find('input').each(function() {
                if (!self.validate(this, parseInput(this))) {
                    valid = false;
                }
            });
            return valid;
        }
    };

    return {
        wrap: function(f, c) { return new Form(f, c); },
        guards: registered,
    };
})();
