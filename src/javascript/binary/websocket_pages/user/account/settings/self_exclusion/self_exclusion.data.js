var SelfExclusionData = (function() {
    function chain(fns) {
        return function(value, old) {
            var errors = [];
            var info = {
                value: value,
                errors: [],
            };
            for (var i = 0; i < fns.length; i++) {
                var next = fns[i](info.value, old);
                next.errors = info.errors.concat(next.errors);
                info = next;
                if (!info.valid) {
                    break;
                }
            }
            return info;
        };
    }


    function isInteger(value, original) {
        var valid = /^\d+$/.test(value);
        return {
            valid: valid,
            value: +value,
            errors: valid ? [] : ['Please enter an integer value'],
        };
    }

    function lessThanPrevious(value, original) {
        var error = text.localize('Please enter a number between 0 and [_1]', [original]);
        var valid = value <= original;
        return {
            valid: valid,
            value: value,
            errors: valid ? [] : [error],
        };
    }

    function minutesWithin(duration) {
        var maxMinutes = duration.as('minutes');
        var error = 'Session duration limit cannot be more than 6 weeks.';
        return function(value) {
            var valid = value <= maxMinutes;
            return {
                valid: valid,
                value: value,
                errors: valid ? [] : [error],
            };
        };
    }

    function validDateString(value) {
        var date  = moment(value, 'YYYY-MM-DD');
        var valid = date.isValid();
        return {
            valid: valid,
            value: date,
            errors: valid ? [] : ['Please select a valid date'],
        };
    }

    function validTimeString(value) {
        var time  = moment(value, 'HH:mm');
        var valid = time.isValid();
        return {
            errors: valid ? [] : ['Please select a valid time'],
            valid: valid,
            value: moment.duration({
                hours:   time.hours(),
                minutes: time.minutes(),
            }),
        };
    }

    return {
        chain: chain,
        isInteger: isInteger,
        lessThanPrevious: lessThanPrevious,
        minutesWithin: minutesWithin,
        validDateString: validDateString,
        validTimeString: validTimeString,
    };
})();
