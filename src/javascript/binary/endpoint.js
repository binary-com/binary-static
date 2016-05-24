pjax_config_page("endpoint", function(){
    return {
        onLoad: function() {
          $('#new_endpoint').on('click', function () {
            var server_url = $('#server_url').val(),
                app_id = $('#app_id').val();
            if (Trim(server_url) !== '') localStorage.setItem('server_url', server_url);
            if (Trim(app_id) !== '') localStorage.setItem('app_id', app_id);
            window.location.reload();
          });
          $('#reset_endpoint').on('click', function () {
            localStorage.removeItem('server_url');
            localStorage.removeItem('app_id');
            window.location.reload();
          });
        }
    };
});
