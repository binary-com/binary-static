pjax_config_page("applications", function(){
    return {
        onLoad: function() {
          Content.populate();
          if (page.client.residence === 'jp' || page.language().toLowerCase() === 'ja') {
            $('.applications-page').empty()
                                   .append('<p class="notice-msg">' + Content.localize().textFeatureUnavailable + '</p>')
                                   .removeClass('invisible');
          } else {
            $('.applications-page').removeClass('invisible');
          }
        }
    };
});
