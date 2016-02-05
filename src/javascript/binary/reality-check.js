RealityCheck = (function ($) {
    "use strict";

    var reality_check_url = page.url.url_for('user/reality_check');
    var reality_freq_url  = page.url.url_for('user/reality_check_frequency');

    RealityCheck.prototype.setInterval = function (intv) {
        this.interval = intv * 60 * 1000; // convert minutes to millisec
        this.storage.set('reality_check.interval', this.interval);
    };

    RealityCheck.prototype.getInterval = function () {
        return this.getIntervalMs() / (60 * 1000); // convert to minutes
        
    };

    RealityCheck.prototype.getIntervalMs = function () {
        if (this.interval > 0) return this.interval;

        this.interval = parseFloat(this.storage.get('reality_check.interval'));

        // use default if garbage
        if (isNaN(this.interval) || this.interval<=0)
            this.interval = this.default_interval;

        return this.interval;
    };

    RealityCheck.prototype.setAlarm = function () {
        var that = this;
        var intv = this.getIntervalMs();
        var alrm = intv - (Date.now() - this.basetime) % intv;

        if (this.tmout) window.clearTimeout(this.tmout);

        this.tmout = window.setTimeout(function () {
            that.fire();
        }, alrm);
    };

    RealityCheck.prototype._fire = function (url, next) {
        var that = this;

        $.ajax({
            url: url,
            dataType: 'text',
            success: function (data) {
                next.call(that, data);
            },
            error: function (xhr) {
                if (xhr.status === 404) return; // no MF loginid
                window.setTimeout(function () {
                    that.fire();
                }, 5000);
            },
        });
    };

    RealityCheck.prototype.fire = function () {
        this._fire(reality_check_url, this.display);
    };

    RealityCheck.prototype.display = function (data) {
        var that = this, outer, middle, storage_handler; 

        outer = $('#reality-check');
        if (outer) outer.remove();

        outer = $("<div id='reality-check' class='lightbox'></div>").appendTo('body');
        middle = $('<div />').appendTo(outer);
        $('<div>' + data + '</div>').appendTo(middle);
        $('#reality-check [interval=1]').val(this.getInterval());

        storage_handler = function (jq_event) {
            var ack;

            if (jq_event.originalEvent.key !== 'reality_check.ack') return;
            ack = parseInt(jq_event.originalEvent.newValue || 1);
            if (ack > that.lastAck) {
                // console.log('Display storage handler');

                $(window).off('storage', storage_handler);
                that.setAlarm();
                $('#reality-check').remove();
            }
        };

        // in case the client works with multiple windows, check if he has acknowleged
        // it in another window.
        $(window).on('storage', storage_handler);

        this.lastAck = parseInt(this.storage.get('reality_check.ack') || 1);
        $('#reality-check [bcont=1]').on('click', function () {
            var intv = parseFloat($('#reality-check [interval=1]').val());
            if (isNaN(intv) || intv <= 0) {
                $('#reality-check p.msg').show('fast');
                return;
            }
            that.setInterval(intv);
            that.storage.set('reality_check.ack', that.lastAck+1);
            $(window).off('storage', storage_handler);
            that.setAlarm();
            $('#reality-check').remove();
        });

        $('#reality-check #btn_logout').unbind('click').click(function(){
            BinarySocket.send({"logout": "1"});
        });
        
        var obj = document.getElementById('realityDuration');
        this.isNumericValue(obj);
    };
    //
    //limit textBox to Numeric Only
    //
    RealityCheck.prototype.isNumericValue = function(obj){

        if (obj.hasOwnProperty('oninput') || ('oninput' in obj)) 
        {
            $('#realityDuration').on('input', function (event) { 
                 this.value = this.value.replace(/[^0-9]/g, '');
            });
        }
    };

    // On session start we need to ask for the reality-check interval.
    // This is an ajax call because it depends on the user's language.

    RealityCheck.prototype.askForFrequency = function () {
        this._fire(reality_freq_url, this.displayFrequencyChoice);
    };

    RealityCheck.prototype.displayFrequencyChoice = function (data) {
        var that = this, outer, middle, storage_handler, click_handler; 

        outer = $('#reality-check');
        if (outer) outer.remove();

        outer = $("<div id='reality-check' class='lightbox'></div>").appendTo('body');
        middle = $('<div />').appendTo(outer);
        $('<div>' + data + '</div>').appendTo(middle);
        $('#reality-check [interval=1]').val(this.getInterval());

        this.storage.set('reality_check.askingForInterval', 1);
        storage_handler = function (jq_event) {
            var ack;

            if (jq_event.originalEvent.key !== 'reality_check.ack') return;

            ack = parseInt(jq_event.originalEvent.newValue || 1);
            if (ack > that.lastAck) {
                // console.log('FreqSet storage handler');

                $(window).off('storage', storage_handler);
                $('#reality-check').remove();
                that.setAlarm();
            }
        };

        // in case the client works with multiple windows, check if he has acknowleged
        // it in another window.
        $(window).on('storage', storage_handler);

        this.lastAck = parseInt(this.storage.get('reality_check.ack') || 1);
        click_handler = function () {
            var intv = parseFloat($('#reality-check [interval=1]').val());
            if (isNaN(intv) || intv <= 0) {
                $('#reality-check p.msg').show('fast');
                return;
            }

            // console.log('set interval handler: intv = '+intv);
            that.storage.remove('reality_check.askingForInterval');

            that.setInterval(intv);
            that.storage.set('reality_check.ack', that.lastAck+1);
            $(window).off('storage', storage_handler);
            $('#reality-check').remove();
            that.setAlarm();
        };
        $('#reality-check [bcont=1]').on('click', click_handler);
        $('#reality-check [interval=1]').on('change', click_handler);


        var obj = document.getElementById('realityDuration');
        this.isNumericValue(obj);
    };

    function RealityCheck(cookieName, persistentStore) {
        var val, that = this;

        val = ($.cookie(cookieName)||'').split(',');
        val[0] = parseFloat(val[0]);
        if (isNaN(val[0]) || val[0]<=0) return;  // no or invalid cookie
        this.default_interval = val[0] * 60 * 1000;

        this.storage = persistentStore;

        // A storage event handler is used to notify about interval changes.
        // That way all windows see the same interval.
        $(window).on('storage', function (jq_event) {
            if (jq_event.originalEvent.key === 'reality_check.interval') {
                that.interval = parseFloat(jq_event.originalEvent.newValue);

                // garbage here can only happen if the user tries to tamper
                if (isNaN(that.interval) || that.interval<=0)
                    that.interval = that.default_interval;

                // console.log('interval storage handler new value = '+that.interval);

                that.setAlarm();
            }

            if (jq_event.originalEvent.key === 'reality_check.basetime') {
                var val = parseInt(jq_event.originalEvent.newValue);

                // garbage here can only happen if the user tries to tamper
                if (isNaN(val) || val<=0) return;
                that.basetime = val;

                // console.log('basetime storage handler new value = '+that.basetime);

                that.setAlarm();
            }
        });

        // The cookie is formatted as DEFAULT_INTERVAL , SERVER_TIME_WHEN_IT_WAS_ISSUED
        // We save the server time in local storage. If the stored time differs from
        // the cookie time we are in a new session. Hence, we have to reset all stored
        // data and to ask the user to check the reality-check frequency.

        if (val[1] && val[1] != persistentStore.get('reality_check.srvtime')) {
            persistentStore.set('reality_check.srvtime', val[1]);
            persistentStore.set('reality_check.basetime', this.basetime = new Date().getTime());
            persistentStore.set('reality_check.ack', 1);
            this.askForFrequency();
        } else if (persistentStore.get('reality_check.askingForInterval')) {
            this.basetime = parseInt(persistentStore.get('reality_check.basetime'));
            this.askForFrequency();
        } else {
            this.basetime = parseInt(persistentStore.get('reality_check.basetime'));
            this.setAlarm();
        }
    }

    return RealityCheck;
}(jQuery));

//if (!/backoffice/.test(document.URL)) { // exclude BO
//    $(document).ready(function () {
//        if (window.reality_check_object) return;
//        window.reality_check_object = new RealityCheck('reality_check',
//                                                       LocalStore);
//    });
//}
