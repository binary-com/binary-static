var SelfExclusionData = (function() {
    function chain(validators) {
        return function(value) {
            var info = {
                valid: true,
                value: value,
                errors: [],
            };
            for (var i = 0; i < validators.length; i++) {
                info = validators[i](info.value);
                if (!info.valid) break;
            }
            return info;
        };
    }

    function isInteger(value) {
        var valid = /^\d+$/.test(value);
        return {
            valid: valid,
            value: +value,
            errors: valid ? [] : ['Please enter an integer value'],
        };
    }

    function smallerThan(b) {
        return function(a) {
            var valid = !(a.length === b.length ? a > b : a.length > b.length);
            return {
                valid: valid,
                value: a,
                errors: valid ? [] : [text.localize('Please enter a number between 0 and [_1]').replace('[_1]', b)],
            };
        };
    }

    function validSessionDuration(value) {
        var max = moment.duration(6, 'weeks');
        var valid = value <= max.as('minutes');
        return {
            valid: valid,
            value: value,
            errors: valid ? [] : ['Session duration limit cannot be more than 6 weeks'],
        };
    }

    return {
        chain: chain,
        isInteger: isInteger,
        validSessionDuration: validSessionDuration,
        smallerThan: smallerThan,
    };
})();
