function DateTimePicker(params) {
    var $self = this;
    this.date_inp = "#" + params.id + "_date";
    this.time_inp = "#" + params.id + "_time";
    this.minDateTime = params.minDateTime || new Date(2010, 1, 1);
    this.maxDateTime = params.maxDateTime || new Date();
    this.onChange = params.onChange || function() {};
    $(this.date_inp).datepicker({
        minDate: this.minDateTime,
        maxDate: this.maxDateTime,
        dateFormat: "yy-mm-dd",
        monthNames: [text.localize('January'), text.localize('February'), text.localize('March'), text.localize('April'), text.localize('May'), text.localize('June'),
                     text.localize('July'), text.localize('August'), text.localize('September'), text.localize('October'), text.localize('November'), text.localize('December') ],
        dayNamesShort: [text.localize('Su'), text.localize('Mo'), text.localize('Tu'), text.localize('We'),
                        text.localize('Th'), text.localize('Fr'), text.localize('Sa')],
                nextText: text.localize('Next'),
                prevText: text.localize('Previous'),
    });
    $(this.date_inp).change(function() {
        var date = $self.getDateTime();
        if (date < $self.minDateTime)
            $self.setDateTime($self.minDateTime);
        else if (date > $self.maxDateTime)
            $self.setDateTime($self.maxDateTime);
        $self.onChange($self.getDateTime());
    });
    $(this.time_inp).change(function() {
        if(!$(this).val().match(/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)) {
            $(this).val("00:00:00");
        }
        var date = $self.getDateTime();
        if (date < $self.minDateTime)
            $self.setDateTime($self.minDateTime);
        else if (date > $self.maxDateTime)
            $self.setDateTime($self.maxDateTime);
        $self.onChange($self.getDateTime());
    });
}

DateTimePicker.prototype = {
    getDateTime: function() {
        var date = $(this.date_inp).val().match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/);
        if (!date) return null;
            var year = date[1], month = date[2], day = date[3];
        var time = $(this.time_inp).val().match(/^([01][0-9]|2[0-3]):([0-5]\d)(:([0-5]\d))?$/);
        var hour = 0, minute = 0, second = 0;
        if (time) {
            hour = time[1];
            minute = time[2];
            second = time[3] ? time[4] : 0;
        }
        return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    },
    setDateTime: function(date) {
        var dateStr = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
        $(this.date_inp).datepicker("setDate", dateStr);
        var hours = date.getUTCHours() || 0;
        if (hours < 10) hours = '0' + hours;
            var minutes = date.getUTCMinutes() || 0;
        if (minutes < 10) minutes = '0' + minutes;
            var seconds = date.getUTCSeconds() || 0;
        if (seconds < 10) seconds = '0' + seconds;
            $(this.time_inp).val(hours + ':' + minutes + ':' + seconds);
        this.onChange(this.getDateTime());
    },
    setMinDateTime: function(date) {
        this.minDateTime = date;
        if (this.getDateTime < date) {
            this.setDateTime(date);
        }
        $(this.date_inp).datepicker("option", "minDate", date);
    },
    setMaxDateTime: function(date) {
        this.maxDateTime = date;
        if (this.getDateTime > date) {
            this.setDateTime(date);
        }
        $(this.date_inp).datepicker("option", "maxDate", date);
    },
    clear: function() {
        $(this.date_inp).val("");
        $(this.time_inp).val("");
    }
};
