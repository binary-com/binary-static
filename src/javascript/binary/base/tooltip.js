var ToolTip = function() {
    this.tooltip = $('#tooltip');

    if (this.tooltip.length === 0) {
        this.tooltip = $('<div id="tooltip"></div>');
        this.tooltip.css('display', 'none')
            .appendTo('body');
    }

    this.showing = {};
    var that = this;
    $(window).resize(function() { that.resize_tooltip(); });
};

ToolTip.prototype = {
    attach: function() {
        var that = this;
        this.detach();

        var targets = $( '[rel~=tooltip]' ),
            target  = false,
            tip     = false,
            title   = false;

        targets.on('mouseenter', function(e) {
            tip = $(this).attr( 'title' );

            if( !tip || tip === '' )
                return false;

            that.showing.target = $(this);
            that.showing.tip = tip;

            that.showing.target.removeAttr( 'title' );

            that.tooltip.html(tip);
            that.resize_tooltip();
            that.reposition_tooltip_for(that.showing.target);
            that.show_tooltip($(this));
        });

        targets.on('mouseleave', function() {
            if(that.showing.target) {
                that.showing.target.attr( 'title', that.showing.tip );
            }
            that.hide_tooltip();
        });

        targets.on('click', function() {
            if(that.showing.target) {
                that.showing.target.attr( 'title', that.showing.tip );
            }
            that.hide_tooltip();
        });
    },
    detach: function() {
        $( '[rel~=tooltip]' ).off('mouseenter');
        $( '[rel~=tooltip]' ).off('mouseleave');
        this.tooltip.off('click');
    },
    show_tooltip: function(target) {
        this.tooltip.css({ display: ''});
        this.tooltip.zIndex(target.zIndex() + 100);
    },
    hide_tooltip: function(tooltip) {
        this.tooltip.html("");
        this.tooltip.css({ top: 0, left: 0, display: 'none'});
        this.tooltip.addClass('invisible');
    },
    resize_tooltip: function() {
        if( $( window ).width() < this.tooltip.outerWidth() * 1.5 )
            this.tooltip.css( 'max-width', $( window ).width() / 2 );
        else
            this.tooltip.css( 'max-width', 340 );
    },
    reposition_tooltip_for: function(target) {
        this.tooltip.removeClass('invisible');

        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( this.tooltip.outerWidth() / 2 ),
            pos_top = target.offset().top - (this.tooltip.outerHeight() + 10);

        this.tooltip.removeClass( 'left' );
        this.tooltip.removeClass( 'right' );
        this.tooltip.removeClass( 'top' );

        if( pos_left < 0 ) {
            pos_left = target.offset().left + target.outerWidth() / 2 - 20;
            this.tooltip.addClass( 'left' );
        }

        if( pos_left + this.tooltip.outerWidth() > $( window ).width() ) {
            pos_left = target.offset().left - this.tooltip.outerWidth() + target.outerWidth() / 2 + 20;
            this.tooltip.addClass( 'right' );
        }

        if( pos_top < 0 ) {
            pos_top  = target.offset().top + target.outerHeight() + 20;
            this.tooltip.addClass( 'top' );
        }

        this.tooltip.css( { left: pos_left, top: pos_top} );
    },
};
