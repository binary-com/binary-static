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
        if (!valid) {
            return {
                value: date,
                valid: false,
                errors: ['Please select a valid date'],
            };
        }
        var now = moment();
        var isAfterNow = date.isAfter(now);
        return {
            value: date,
            valid: isAfterNow,
            errors: isAfterNow ? [] : ['Exclude time must be after today'],
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

    function validTimeoutUntil(value) {
        var max = moment().add(moment.duration(6, 'weeks'));
        var valid = value.isAfter(max);
        return {
            errors: valid ? [] : ['Exclude time cannot be more than 6 weeks.'],
            valid:  valid,
            value:  value,
        };
    }

    function validExclusion(value) {
        var min = moment().add(moment.duration(6, 'months'));
        var max = moment().add(moment.duration(5, 'years'));
        if (value.isBefore(min)) {
            return {
                errors: ['Exclude time cannot be less than 6 months.'],
                valid:  false,
                value:  value,
            };
        }
        if (value.isAfter(max)) {
            return {
                errors: ['Exclude time cannot be for more than 5 years.'],
                valid: false,
                value: value,
            };
        }
        return {
            valid: true,
            value: value,
            errors: [],
        };
    }

    return {
        chain: chain,
        isInteger: isInteger,
        lessThanPrevious: lessThanPrevious,
        minutesWithin: minutesWithin,
        validDateString: validDateString,
        validTimeString: validTimeString,
        validExclusion:  validExclusion,
        validTimeoutUntil: validTimeoutUntil,
    };
})();
