// json to hold all the events loaded on trading page
var trade_event_bindings = {};

function confirm_popup_action() {

    $('.bom_confirm_popup_link').on('click', function (e){
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: this.href,
            data: 'ajax_only=1',
            success: function (html) {
                SpotLight.set_content(html);
                SpotLight.show();
            }
        });
    });
}

var hide_payment_agents = function() {
    var language = page.language();
    if(language == 'JA') {
        $('.payment_agent_methods').addClass('invisible');
    }
};

onLoad.queue_for_url(confirm_popup_action, 'my_accountws|confirm_popup');
onLoad.queue_for_url(hide_payment_agents, 'cashier');

onLoad.queue_for_url(function() {
    $('div.further-info')
    .children('div').hide().end()
    .children('a').click(function() {
        $(this).siblings('div').toggle();
        return false;
    });
}, '/c/paymentagent_list');
