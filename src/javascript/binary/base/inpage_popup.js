/**
 * Synopsis
 *
 * var p = new InPagePopup({content: 'popup content'});
 * p.attach('button.open-popup');
 * // and now $('button.open-popup').get(0).inpage_poup is a reference to p
 *
 */
var InPagePopup = function(conf) {
    if (!conf) conf = {};
    if (typeof conf != 'object') {
        conf = {content: conf};
    }
    this.element = null;
    this._container = null;
    this.width = conf.width || null;
    this.close_on_escape = typeof conf.close_on_escape == 'undefined' ? true : conf.close_on_escape;
    this.draggable = typeof conf.draggable == 'undefined' ? true : conf.draggable;
    this.drag_handle = conf.drag_handle || '.drag-handle';
    this.ajax_conf = conf.ajax_conf || null;
    this._content = conf.content || '';
};

/**
 * Update the configuations of the pipup, change the width,
 * set draggable or not, etc.
 */
InPagePopup.prototype.config = function(conf) {
    if (conf.width) this.width = conf.width;
    if (typeof conf.close_on_escape != 'undefined') this.close_on_escape = !!conf.close_on_escape;
    if (typeof conf.draggable != 'undefined') this.draggable = !!conf.draggable;
    if (conf.drag_handle) this.drag_handle = conf.drag_handle;
    if (conf.ajax_conf) this.ajax_conf = conf.ajax_conf;
};

/**
 * Get or set the contens of the popup.
 *
 * @param new_content: set the new content
 */
InPagePopup.prototype.content = function(new_content) {
    var me = this;
    if (typeof new_content == 'undefined') {
        if (this._container) {
            return $('.inpage_popup_content', me._container).html();
        }
        return this._content;
    }
    if (this._container) {
        $('.inpage_popup_content', me._container).html(_new_content);
    } else {
        this._content = new_content;
    }
    return this;
};

/**
 * Finds the contents of the popup from the specified element.
 */
InPagePopup.prototype.find_element_popup_content = function(element) {
    if (!element) throw new Error("failed to detect element contents. no element specified");
    var jqel = $(element);
    var num = jqel.length;
    for (i = 0; i < num; i++) {
        var el = jqel.get(i);
        var elid = $(el).attr('id');
        if (elid) {
            var content_id = elid + '-content';
            var contents = $('.inpage_popup_content#' + content_id);
            if (contents.length) {
                return contents.first();
            }
        }
    }
    return null;
};

InPagePopup.prototype._ajax_request = function(callback, errback) {
    conf = {};
    if (this.ajax_conf) conf = (typeof this.ajax_conf == 'function') ? this.ajax_conf() : this.ajax_conf;
    if (typeof conf != 'object') conf = {url : conf};
    if (callback) conf.success = callback;
    if (errback) conf.error = errback;
    $.ajax(conf);
    return this;
};

/**
 * fetch contents of the inpage popup via AJAX.
 * Paramters passed to callbacks are standard jQuery params, with the popup object itself in the end.
 *
 * @param show: show the popup after data is fetched or not.
 * @param before_show: callback to be called before showing the popup. used for processing server response.
 *                     If this method returns a string it is considered as the new contents of the popup.
 *                     If it returns false or throws an error, the popup is not going to be shown.
 * @param after_show: callback to be called after showing the popup.
 * @param errback: errback to be called when errors occurred fetching data
 */
InPagePopup.prototype.fetch_remote_content = function(show, before_show, after_show, errback) {
    var me = this;
    if (!errback) {
        errback = function(jqxhr, txt_status, err) {
            throw new Error("Failed to fetch contents of the popup: " + err);
        };
    }
    var run_callbacks = function (data, txt_status, jqxhr) {
        if (before_show) {
            data = before_show(data, txt_status, jqxhr, me);
            if (!data) return false;
        }
        me.content(data);
        if (show !== false) me.show();
        if (after_show) after_show(data, txt_status, jqxhr, me);
    };
    this._ajax_request(run_callbacks, errback);
    return this;
};

/**
 * Initialize the container, set the contents and return it.
 */
InPagePopup.prototype._init_container = function() {
    this.close();
    var me = this;
    var container = $('<div class="inpage_popup_container"><a class="close">x</a></div>');
    var content = this.element ? this.find_element_popup_content(this.element) : null;
    var jq_content = content ? content.clone() : null;
    if (!jq_content) jq_content = $('<div class="inpage_popup_content">' + this._content + '</div>');
    container.append(jq_content);
    container.hide();
    jq_content.show().removeClass('invisible');
    $(document.body).append(container);
    if (me.width) container.width(me.width);
    this._container = container;
    container.find('.close').on('click', function() { me.close(); });
    if (this.close_on_escape) {
        $(document).on('keydown', function(e) {
            if (e.which == 27) me.close();
        });
    }
    if (this.draggable) {
        handle = this.drag_handle;
        drag_opts = {};
        if ( $(handle, container).length ) {
            drag_opts['handle'] = handle;
        }
        container.draggable(drag_opts);
    }
    this.reposition();
    return container;
};

/**
 * Reposition the popup on the screen. by default uses the center of the screen.
 */
InPagePopup.prototype.reposition = function(x, y) {
    if (this._container) {
        var win_ = $(window);
        var container = this._container;
        if (typeof x == 'undefined') {
            x = Math.max(Math.floor((win_.width() - container.width()) / 2), 50) + win_.scrollLeft();
        }
        if (typeof y == 'undefined') {
            y = Math.max(Math.floor((win_.height() - container.height()) / 2), 50) + win_.scrollTop();
        }
        this._container.offset({left: x, top: y});
    }
    return this;
};

/**
 * Return the container of the popup.
 */
InPagePopup.prototype.container = function() {
    if (!this._container) this._init_container();
    return this._container;
};

InPagePopup.prototype.show = function() {
    this.container().show();
    return this;
};

InPagePopup.prototype.close = function() {
    if (this._container) {
        this._container.hide().remove();
    }
    this._container = null;
    return this;
};

/**
 * Attaches the inpage popup to the specified element.
 *
 * each element would have a new property of 'inpage_popup' which
 * will reference to this same popup.
 *
 * @param element: any jQuery selector, or DOM or jquery object
 */
InPagePopup.prototype.attach = function(element) {
    var me = this;
    this.detach();
    var jqel = $(element);
    if (!jqel.length) {
        throw new Error("Failed to attach inpage popup. no such element exists for: " + element);
    }
    this.element = jqel;
    this.element.on('click', function(e) { e.preventDefault(); me.show(); });
    jqel.each( function () { this.inpage_popup = me; });
    return this;
};

/**
 * Detach the popup from element.
 */
InPagePopup.prototype.detach = function() {
    var me = this;
    if (this.element) {
        this.element.off('click');
        this.element.each( function () { this.inpage_popup = null; } );
    }
    this.element = null;
    return this;
};
