var SelfExclusionData = (function() {
    function validator(guards) {
        return function(value, old) {
            for (var i = 0; i < guards.length; i++) {
                var err = guards[i](value, old);
                if (err) {
                    return err;
                }
            }
            return null;
        };
    }

    function isInteger(value) {
        return /^\d+$/.test(value) ? null : 'Please enter an integer value';
    }

    function lessThanPrevious(value, original) {
        var error = text.localize('Please enter a number between 0 and [_1]', [original]);
        return (original && +value > +original) ? error : null;
    }

    function validSessionDuration(value) {
        var maxMinutes = moment.duration(6, 'weeks').as('minutes');
        var error = 'Session duration limit cannot be more than 6 weeks.';
        return value <= maxMinutes ? null : error;
    }

    function validDateString(value) {
        var now = moment();
        var date = moment(value, 'YYYY-MM-DD');
        if (!date.isValid()) {
            return 'Please select a valid date';
        }
        return date.isAfter(now) ? null : 'Exclude time must be after today';
    }

    function validTimeString(value) {
        var time = moment(value, 'HH:mm');
        return time.isValid() ? null : 'Please select a valid time';
    }

    function validTimeoutUntil(value) {
        var max = moment().add(moment.duration(6, 'weeks'));
        return value.isAfter(max) ? 'Exclude time cannot be more than 6 weeks.' : null;
    }

    function validExclusion(value) {
        var min = moment().add(moment.duration(6, 'months'));
        var max = moment().add(moment.duration(5, 'years'));
        if (value.isBefore(min)) {
            return 'Exclude time cannot be less than 6 months.';
        }
        if (value.isAfter(max)) {
            return 'Exclude time cannot be for more than 5 years.';
        }
        return null;
    }

    return {
        validator: validator,
        valid: {
            integer:    isInteger,
            limit:      lessThanPrevious,
            session:    validSessionDuration,
            dateString: validDateString,
            timeString: validTimeString,
            exclusion:  validExclusion,
            timeout:    validTimeoutUntil,
        },
    };
})();
