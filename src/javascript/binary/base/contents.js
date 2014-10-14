var Contents = function(client) {
    this.client = client;
    this.tooltip = new ToolTip();
};

Contents.prototype = {
    on_load: function() {
        this.activate_by_client_type();
        this.update_body_id();
        this.update_content_class();
        this.tooltip.attach();
        this.init_draggable();
    },
    on_unload: function() {
        this.tooltip.detach();
        if ($('.unbind_later').length > 0) {
            $('.unbind_later').off();
        }
    },
    activate_by_client_type: function() {
        $('.by_client_type').addClass('invisible');
        if(this.client.is_logged_in) {
            if(this.client.is_real) {
                $('.by_client_type.client_real').removeClass('invisible');
                $('.by_client_type.client_real').show();
            } else {
                $('.by_client_type.client_virtual').removeClass('invisible');
                $('.by_client_type.client_virtual').show();
            }
        } else {
            $('.by_client_type.client_logged_out').removeClass('invisible');
            $('.by_client_type.client_logged_out').show();
        }
    },
    update_body_id: function() {
        //This is required for our css to work.
        $('body').attr('id', '');
        $('body').attr('id', $('#body_id').html());
    },
    update_content_class: function() {
        //This is required for our css to work.
        $('#content').removeClass();
        $('#content').addClass($('#content_class').html());
    },
    init_draggable: function() {
        $('.draggable').draggable();
    },
};
