function done_typing(elem, config) {
    var onStart = config.start || function() {};
    var onStop  = config.stop  || function() {};
    var delay   = config.delay || 200;

    var stopped = true;
    var timeout = null;

    function down(ev) {
        if (stopped) {
            onStart(ev);
            stopped = false;
        }
        clearTimeout(timeout);
    }

    function up(ev) {
        timeout = setTimeout(function() {
            timeout = null;
            stopped = true;
            onStop(ev);
        }, delay);
    }

    elem.addEventListener('keydown', down);
    elem.addEventListener('keyup', up);
};

if (typeof module !== 'undefined') {
    module.exports = done_typing;
}
