
var Footer = function() { };

Footer.prototype = {
    on_load: function() {
        var that = this;
        var footer = $('#footer');
        this.make_sticky();
        $(window).resize(function() {
            footer.css({'margin-top': 0});
            that.make_sticky();
        });
        $(window).bind('hashchange', function() {
            that.make_sticky();
        });
    },
    make_sticky: function() {
        var docHeight = $(window).height();
        var footer = $('#footer');
        if (footer.length > 0) {
            var footerHeight = footer.height();
            var footerTop = footer.offset().top + footerHeight;

            if (footerTop < docHeight) {
                var margintop = $('body').prop('scrollHeight') - footer.offset().top - footer.height();
                if (margintop > 0) {
                    // Create the measurement node
                    var scrollDiv = document.createElement("div");
                    scrollDiv.className = "scrollbar-measure";
                    document.body.appendChild(scrollDiv);
                    // Get the scrollbar width
                    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                    // Delete the DIV
                    document.body.removeChild(scrollDiv);
                    // hack for browser other than firefox
                    if (navigator.userAgent.indexOf("Firefox") > -1) {
                        footer.css({'margin-top': margintop + 'px'});
                    } else {
                        margintop += scrollbarWidth - 1;
                        footer.css({'margin-top': margintop + 'px'});
                    }
                }
            }
        }
    }
};
