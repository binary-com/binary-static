//For object shape coherence we create named objects to be inserted into the queue.
var URLPjaxQueueElement = function(exec_function, url) {
    this.method = exec_function;
    if(url) {
        this.url = new RegExp(url);
    } else {
        this.url = /.*/;
    }
};

URLPjaxQueueElement.prototype = {
    fire: function(in_url) {
        if(this.url.test(in_url)) {
            this.method();
        }
    }
};

var IDPjaxQueueElement = function(exec_function, id) {
    this.method = exec_function;
    this.sel = '#' + id;
};

IDPjaxQueueElement.prototype = {
    fire: function() {
        if($(this.sel).length > 0) {
            this.method();
        }
    }
};

var PjaxExecQueue = function () {
    this.url_exec_queue = [];
    this.id_exec_queue = [];
    this.fired = false;
    this.content = $('#content');
};

PjaxExecQueue.prototype = {
    queue: function (exec_function) {
        this.url_exec_queue.unshift(new URLPjaxQueueElement(exec_function));
    },
    queue_for_url: function (exec_function, url_pattern) {
        this.url_exec_queue.unshift(new URLPjaxQueueElement(exec_function, url_pattern));
    },
    queue_if_id_present: function(exec_function, id) {
        this.id_exec_queue.unshift(new IDPjaxQueueElement(exec_function, id));
    },
    fire: function () {
        if(!this.fired) {
            var match_loc = window.location.href;
            var i = this.url_exec_queue.length;
            while(i--) {
                this.url_exec_queue[i].fire(match_loc);
            }

            i = this.id_exec_queue.length;
            while(i--) {
                this.id_exec_queue[i].fire(match_loc);
            }
        }
        this.fired = true;
    },
    reset: function() {
        this.fired = false;
    },
    loading: function () {
        this.reset();
    },
    count: function () {
        return exec_queue.length;
    },
    show: function (for_url) {
        for (var i=0; i < exec_queue.length; i++) {
            if(for_url) {
                if(exec_queue[i].url.test(for_url)) {
                    console.log("" + exec_queue[i].method);
                }
            } else {
                console.log(exec_queue[i].url + " : " + exec_queue[i].method);
            }
        }
    }
};

var pjax_config_page = function(url, exec_functions) {
    var functions = exec_functions();
    if (functions.onLoad) onLoad.queue_for_url(functions.onLoad, url);
    if (functions.onUnload) onUnload.queue_for_url(functions.onUnload, url);
};

var pjax_config = function() {
    return {
        'container': 'content',
        'beforeSend': function() {
            onLoad.loading();
            onUnload.fire();
        },
        'complete': function() {
            page.is_loaded_by_pjax = true;
            onLoad.fire();
            onUnload.reset();
        },
        'error': function(event) {
            var error_text = SessionStore.get('errors.500');
            if(error_text) {
                $('#content').html(error_text);
            } else {
                $.get('/errors/500.html').always(function(content) {
                    var tmp = document.createElement('div');
                    tmp.innerHTML = content;
                    tmpNodes = tmp.getElementsByTagName('div');
                    for(var i=0,l=tmpNodes.length;i<l;i++){
                        if(tmpNodes[i].id == 'content') {
                            SessionStore.set('errors.500', tmpNodes[i].innerHTML);
                            $('#content').html(tmpNodes[i].innerHTML);
                            break;
                        }
                    }
                });
            }

            $('#server_clock').html('GMT Time: ' + moment(page.header.time_now).utc().format("YYYY-MM-DD HH:mm"));

        },
        'useClass': 'pjaxload',
    };
};

var init_pjax = function () {
    var document_location = document.URL;
    if(!/backoffice/.test(document_location)) { //No Pjax for backoffice.
        pjax.connect(pjax_config());
    }
};

var load_with_pjax = function(url) {
        if(page.url.is_in(new URL(url))) {
            return;
        }

        var config = pjax_config();
        config.url = url;
        config.update_url = url;
        config.history = true;
        pjax.invoke(config);
};

// Reduce duplication as required Auth is a common pattern
var pjax_config_page_require_auth = function(url, exec) {
    var redirect = function() {
        window.location.href = page.url.url_for('login');
    };

    var oldOnLoad = exec().onLoad;
    var newOnLoad = function() {
        if (!getCookieItem('login')) {
            redirect();
        } else {
            oldOnLoad();
        }
    };

    var newExecFn = function(){
        return {
            onLoad: newOnLoad,
            onUnload: exec().onUnload
        };
    };
    pjax_config_page(url, newExecFn);
};
