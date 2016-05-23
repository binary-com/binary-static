var SpotLight = function (){
    var that = {};

    that.spot_light_box = function () {
        var spot_light_box = $('#spot-light-box');
        if (!spot_light_box.size())
        {
            spot_light_box = $('<div id="spot-light-box" class="invisible"></div>').appendTo('body');
        }

        return spot_light_box;
    };

    that.cover_page = function () {
        var transparent_cover = $('#transparent-cover');
        if (!transparent_cover.size())
        {
            transparent_cover = $('<div id="transparent-cover"></div>').appendTo('body');
        }

        transparent_cover.removeClass('invisible');
    };
    that.uncover_page = function () {
        $('#transparent-cover').addClass('invisible');
    };

    that.show = function () {
        that.spot_light_box().removeClass('invisible');
        that.cover_page();
        that.activate_buttons();
    };
    that.hide = function () {
        that.spot_light_box().addClass('invisible');
        that.uncover_page();
    };

    that.set_content = function (content) {
        that.spot_light_box().get(0).innerHTML = content;
    };

    that.attach_click_event = function (selector, event) {
        that.spot_light_box().delegate(selector, 'click', event);
    };

    that.activate_buttons = function() {
        $('.close_button').on('click', function (event) {
            $(this).parents('.rbox-shadow-popup').toggleClass('invisible');
            $('#transparent-cover').toggleClass('invisible');
        });

        $('.no_button').on('click', function (event) {
            $(this).parents('.rbox-shadow-popup').toggleClass('invisible');
            $('#transparent-cover').toggleClass('invisible');
        });
    };

    return that;
}();
