var GetStarted = (function() {
    var select_nav_element = function() {
      var $navLink = $('.nav li a');
      var $navList = $('.nav li');
      $navList.removeClass('selected');
      for (var i = 0; i < $navLink.length; i++) {
        if ($navLink[i].href.match(window.location.pathname)) {
          document.getElementsByClassName('nav')[0].getElementsByTagName('li')[i].setAttribute('class', 'selected');
          break;
        }
      }
      return;
    };

    var get_started_behaviour = function() {
        var update_active_subsection = function(to_show) {
            var fragment;
            var subsection = $('.subsection');
            subsection.addClass('hidden');
            to_show.removeClass('hidden');
            var nav_back = $('.subsection-navigation .back');
            var nav_next = $('.subsection-navigation .next');

            if (to_show.hasClass('first')) {
                nav_back.addClass('button-disabled');
                nav_next.removeClass('button-disabled');
            } else if (to_show.hasClass('last')) {
                nav_back.removeClass('button-disabled');
                nav_next.addClass('button-disabled');
            } else {
                nav_back.removeClass('button-disabled');
                nav_next.removeClass('button-disabled');
            }

            fragment = to_show.find('a[name]').attr('name').slice(0, -8);
            document.location.hash = fragment;

            return false;
        };

        var to_show;
        var nav = $('.get-started').find('.subsection-navigation');
        var fragment;
        var len = nav.length;

        if (len) {
            nav.on('click', 'a', function() {
                var button = $(this);
                if (button.hasClass('button-disabled')) {
                    return false;
                }
                var now_showing = $('.subsection:not(.hidden)');
                var show = button.hasClass('next') ? now_showing.next('.subsection') : now_showing.prev('.subsection');
                return update_active_subsection(show);
            });

            fragment = (location.href.split('#'))[1];
            to_show = fragment ? $('a[name=' + fragment + '-section]').parent().parent('.subsection') : $('.subsection.first');
            update_active_subsection(to_show);
        }
        select_nav_element();
    };

    return {
        get_started_behaviour: get_started_behaviour,
    };
})();

module.exports = {
    GetStarted: GetStarted,
};
