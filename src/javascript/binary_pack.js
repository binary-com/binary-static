/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(1);
	var pjax = __webpack_require__(2);

	__webpack_require__(3);

	// TODO: to be remove after webpack finalized
	var exportAllFunctions = function exportAllFunctions(obj) {
	    for ( var key in obj ) {
	        if ( obj.hasOwnProperty(key) ) {
	            window[key] = obj[key];
	        }
	    }
	};

	exportAllFunctions(config);
	exportAllFunctions(pjax);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	 * Configuration values needed in js codes
	 *
	 * NOTE:
	 * Please use the following command to avoid accidentally committing personal changes
	 * git update-index --assume-unchanged src/javascript/config.js
	 *
	 */

	function getAppId() {
	  return localStorage.getItem('config.app_id') ? localStorage.getItem('config.app_id') :
	               /staging\.binary\.com/i.test(window.location.hostname) ? '1098' : '1';
	}

	function getSocketURL() {
	    var server_url = localStorage.getItem('config.server_url');
	    if(!server_url) {
	        var loginid = Cookies.get('loginid'),
	            isReal  = loginid && !/^VRT/.test(loginid),
	            toGreenPercent = {'real': 100, 'virtual': 0, 'logged_out': 0}, // default percentage
	            categoryMap    = ['real', 'virtual', 'logged_out'],
	            randomPercent = Math.random() * 100,
	            percentValues = Cookies.get('connection_setup'); // set by GTM

	        // override defaults by cookie values
	        if(percentValues && percentValues.indexOf(',') > 0) {
	            var cookiePercents = percentValues.split(',');
	            categoryMap.map(function(cat, idx) {
	                if(cookiePercents[idx] && !isNaN(cookiePercents[idx])) {
	                    toGreenPercent[cat] = +cookiePercents[idx].trim();
	                }
	            });
	        }

	        server_url = (/staging\.binary\.com/i.test(window.location.hostname) ? 'www2' :
	                (isReal  ? (randomPercent < toGreenPercent.real       ? 'green' : 'blue') :
	                 loginid ? (randomPercent < toGreenPercent.virtual    ? 'green' : 'blue') :
	                           (randomPercent < toGreenPercent.logged_out ? 'green' : 'blue'))
	            ) + '.binaryws.com';
	    }
	    return 'wss://' + server_url + '/websockets/v3';
	}

	module.exports = {
	    getAppId: getAppId,
	    getSocketURL: getSocketURL,
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	                    var tmpNodes = tmp.getElementsByTagName('div');
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
	    if(!$('body').hasClass('BlueTopBack')) { //No Pjax for BO.
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
	    var oldOnLoad = exec().onLoad;
	    var newOnLoad = function() {
	        if (!page.client.show_login_if_logout(true)) {
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

	var onLoad = new PjaxExecQueue();
	var onUnload = new PjaxExecQueue();

	init_pjax(); //Pjax-standalone will wait for on load event before attaching.
	$(function() { onLoad.fire(); });

	module.exports = {
	    pjax_config_page_require_auth: pjax_config_page_require_auth,
	    pjax_config_page: pjax_config_page,
	    load_with_pjax: load_with_pjax,
	    PjaxExecQueue: PjaxExecQueue,
	    onLoad: onLoad,
	    onUnload: onUnload,
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var getAppId = __webpack_require__(1).getAppId;
	var getSocketURL = __webpack_require__(1).getSocketURL;
	var pjax_config_page = __webpack_require__(2).pjax_config_page;

	pjax_config_page("endpoint", function(){
	    return {
	        onLoad: function() {
	          $('#server_url').val(getSocketURL().split('/')[2]);
	          $('#app_id').val(getAppId());
	          $('#new_endpoint').on('click', function () {
	            var server_url = ($('#server_url').val() || '').trim().toLowerCase(),
	                app_id = ($('#app_id').val() || '').trim();
	            if (server_url) {
	              if(!/^(ws|www2|www|blue|green)\..*$/i.test(server_url)) server_url = 'www.' + server_url;
	              localStorage.setItem('config.server_url', server_url);
	            }
	            if (app_id && !isNaN(app_id)) localStorage.setItem('config.app_id', parseInt(app_id));
	            window.location.reload();
	          });
	          $('#reset_endpoint').on('click', function () {
	            localStorage.removeItem('config.server_url');
	            localStorage.removeItem('config.app_id');
	            window.location.reload();
	          });
	        }
	    };
	});


/***/ }
/******/ ]);