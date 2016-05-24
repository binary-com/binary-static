pjax_config_page("endpoint", function(){
    return {
        onLoad: function() {
          $('#server_url').val(getSocketURL().split('/')[2]);
          $('#app_id').val(getAppId());
          $('#new_endpoint').on('click', function () {
            var server_url = $('#server_url').val(),
                app_id = $('#app_id').val();
            if (Trim(server_url) !== '') localStorage.setItem('config.server_url', server_url);
            if (Trim(app_id) !== '') localStorage.setItem('config.app_id', app_id);
            window.location.reload();
          });
          $('#reset_endpoint').on('click', function () {
            localStorage.removeItem('config.server_url');
            localStorage.removeItem('config.app_id');
            window.location.reload();
          });
        }
    };
});
