pjax_config_page('/get-started-jp', function() {
    return {
        onLoad: function() {
          if (page.language().toLowerCase() !== 'ja') {
            window.location.href = page.url.url_for('get-started');
          }
          var tab = window.location.hash;
          if (tab && tab !== '') {
            $('#index').hide();
            $('.sidebar-left ul li.' + tab.slice(1, tab.length)).addClass('selected');
            showSelectedTab();
          }
          function showSelectedTab() {
            var updatedTab = window.location.hash;
            $('.contents div').hide();
            if (updatedTab && updatedTab !== '') {
              if ($('#index').is(":visible")) $('#index').hide();
              $('.contents div[id=content-' + updatedTab.slice(1, updatedTab.length) + ']').show();
              $('.contents div[id=content-' + updatedTab.slice(1, updatedTab.length) + '] div').show();
              $('.sidebar-left ul li').removeClass('selected');
              $('.sidebar-left ul li.' + updatedTab.slice(1, updatedTab.length)).addClass('selected');
              $('.contents').show();
            }
            else {
              $('.contents').hide();
              $('.sidebar-left ul li').removeClass('selected');
              $('#index').show();
            }
          }
          $(window).on('hashchange', function(){
            showSelectedTab();
          });
          $('.sidebar-left ul li').click(function(e) {
            $('.sidebar-left ul li').removeClass('selected');
            $(this).addClass('selected');
          });
        }
    };
});
