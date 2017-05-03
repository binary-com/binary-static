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

(function ($) {
    $.fn.setVisibility = function(make_visible) {
        if (make_visible) {
            this.removeClass('invisible');
        } else {
            this.addClass('invisible');
        }
        return this;
    };
})(jQuery);
