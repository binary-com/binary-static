var signup = function() {
    var signup = $('.login-button, .dialog, .overlay').on('click', function() {
        $('.overlay').toggleClass('hidden');
    });
};

var xscroll = function() {
    var xscroll = $("#xscroll").click(function() {
        $('html, body').animate({
            scrollTop: $("#section2").offset().top
        }, 1000);
    });
};

pjax_config_page('/home3', function() {
    return {
        onLoad: function() {
            signup();
        },
    };
});

pjax_config_page('/home4', function() {
    return {
        onLoad: function() {
            signup();
            xscroll();
        },
    };
});
