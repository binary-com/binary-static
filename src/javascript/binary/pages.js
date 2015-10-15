// json to hold all the events loaded on trading page
var trade_event_bindings = {};

var trading_times_init = function() {
      var tabset_name = "#trading-tabs";

     var trading_times = $(tabset_name);
     trading_times.tabs();
     var url = location.href;
     $( "#tradingdate" ).datepicker({ minDate: 0, maxDate:'+1y', dateFormat: "yy-mm-dd", autoSize: true,
     onSelect: function( dateText, picker ){
         trading_times.tabs( "destroy" );
         showLoadingImage(trading_times);
         url = page.url.url_for('resources/trading_times', 'date=' + dateText, 'cached');
         $.ajax({
                  url: url,
                  data:  { 'ajax_only': 1 },
                  success: function(html){
                            trading_times.replaceWith(html);
                            trading_times = $("#trading-tabs");
			                      
                            if (page.language() === 'JA') {	
                              trading_times.tabs("disable");
			    } 
			    else {
			      trading_times.tabs();
			    }
                            
                            page.url.update(url);
                         },
                  error: function(xhr, textStatus, errorThrown){
                          trading_times.empty().append(textStatus);
                       },
                });
         }
     });
};

var asset_index_init = function() {
    var tabset_name = "#asset-tabs";
    // jQueryUI tabs
    $(tabset_name).tabs();
};

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

function get_login_page_url() {
    var params = '';
    try {
        var lang = page.language();
        if (!lang) {
            throw new Error("failed to detect page language");
        }
        params += '?l=' + lang;
    } catch (e) {
        console.log("error while getting page language. " + e);
    }
    return 'https://' + page.settings.get('domains')['private'] + '/login' + params;
}

onLoad.queue_for_url(trading_times_init, 'trading_times');
onLoad.queue_for_url(asset_index_init, 'asset_index');
onLoad.queue_for_url(confirm_popup_action, 'my_account|confirm_popup');
onLoad.queue_for_url(hide_payment_agents, 'cashier');

onLoad.queue_for_url(function() {
    $('div.further-info')
    .children('div').hide().end()
    .children('a').click(function() {
        $(this).siblings('div').toggle();
        return false;
    });
}, '/c/paymentagent_list');
