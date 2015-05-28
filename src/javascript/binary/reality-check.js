RealityCheck = (function ($) {
    "use strict";

    var reality_check_url = page.url.url_for('user/reality_check');

    function RealityCheck(cookieName, persistentStore, logoutLocation) {
        var val;
        
        this.cookieName = cookieName;
        this.storage = persistentStore;

        val = ($.cookie(this.cookieName)||'').split(',');
        val[0] = parseInt(val[0]);
        if (isNaN(val[0]) || val[0]<=0) return;  // no or invalid cookie

        if (val[1] && val[1] != persistentStore.get('reality_check.srvtime')) {
            persistentStore.set('reality_check.srvtime', val[1]);
            persistentStore.set('reality_check.basetime', (new Date()).getTime());
            persistentStore.set('reality_check.ack', 1);
        }

        this.logoutLocation = logoutLocation;
        if (!this.logoutLocation) return; // not logged in?

        this.interval = parseInt(val) * 60 * 1000; // convert minutes to millisec

        this.basetime = persistentStore.get('reality_check.basetime');

        return this.setAlarm();
    }

    RealityCheck.prototype.setAlarm = function () {
        var that = this;
        var alrm = this.interval - ((new Date()).getTime() - this.basetime) % this.interval;

        // console.log('interval = '+this.interval+', next alarm in '+alrm+' ms');
        // console.log('alrm at '+(new Date((new Date()).getTime()+alrm)).toUTCString());

        if (this.tmout) window.clearTimeout(this.tmout);

        this.tmout = window.setTimeout(function () {
            // console.log('fire at '+(new Date()).toUTCString());
            that.fire();
        }, alrm);
    };

    RealityCheck.prototype.fire = function () {
        var that = this;

        $.ajax({
            url: reality_check_url,
            dataType: 'text',
            success: function (data) {
                that.display(data);
            },
            error: function (xhr) {
                if (xhr.status === 404) return; // no MF loginid
                window.setTimeout(function () {
                    that.fire();
                }, 5000);
            },
        });
    };

    RealityCheck.prototype.display = function (data) {
        var that = this, outer, middle, storage_handler; 

        outer = $('#reality-check');
        if (outer) outer.remove();

        outer = $("<div id='reality-check' class='lightbox'></div>").appendTo('body');
        middle = $('<div />').appendTo(outer);
        $('<div>' + data + '</div>').appendTo(middle);

        storage_handler = function (jq_event) {
            var ack;

            if (jq_event.originalEvent.key !== 'reality_check.ack') return;
            ack = parseInt(jq_event.originalEvent.newValue || 1);
            if (ack > that.lastAck) {
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
            that.storage.set('reality_check.ack', that.lastAck+1);
            $(window).off('storage', storage_handler);
            that.setAlarm();
            $('#reality-check').remove();
        });

        $('#reality-check .blogout').on('click', function () {
            window.location.href = that.logoutLocation;
        });
    };

    return RealityCheck;
}(jQuery));

onLoad.queue(function () {
    var logoutBtn = $('#btn_logout')[0];
    if (!logoutBtn) return;
    if (window.reality_check_object) return;
    window.reality_check_object = new RealityCheck('reality_check', LocalStore, logoutBtn.getAttribute('href'));
});
