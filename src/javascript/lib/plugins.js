Element.prototype.hide = function() {
    this.style.display = 'none';
};

Element.prototype.show = function() {
    this.style.display = '';
};

if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

Element.prototype.toggleClass = function(class_name, should_add) {
    if (typeof should_add === 'undefined') { // toggle
        should_add = !this.classList.contains(class_name);
    }
    this.classList[should_add ? 'add' : 'remove'](class_name);
    return this;
};

Element.prototype.setVisibility = function(make_visible) {
    this.toggleClass('invisible', !make_visible);
    return this;
};

Element.prototype.insertAfter = function(referenceNode) {
    referenceNode.parentNode.insertBefore(this, referenceNode.nextSibling);
};

Element.prototype.html = function(content) {
    if (typeof content === 'object') {
        this.innerHTML = '';
        this.appendChild(content);
    } else {
        this.innerHTML = content;
    }
};

(function ($) {
    $.fn.setVisibility = function(make_visible) {
        this[(make_visible ? 'remove' : 'add') + 'Class']('invisible');
        return this;
    };
})(jQuery);
