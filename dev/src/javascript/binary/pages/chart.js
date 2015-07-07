var rearrange_compare_underlying_list = function () {
    var instrument_content = $('#instrument-content');
    instrument_content.find('input').removeAttr('disabled');

    var first_li, line1, symbol, url;
    var all_li = $('#chart_compare_underlying').find('li');

    if (all_li.length == 1) {
        $('#instrument-content').find('input:checked').attr('disabled', true);
    }

    all_li.each(function (index) {
        var li = $(this);
        var instrument = instrument_content.find('#s_'+li.find('input[type=checkbox]').val().replace(/-$/,''));

        li.removeClass().addClass('line_'+(index+1));

        if (index === 0) {
            instrument.attr('checked', 'checked');
        }
    });

};

// Check input error
var check_input_error = function (container)
{
    var valid = true;

    container
        .find('.errorfield').remove()
        .end()
        .find('input[type=text]').each(function (){
            var error_message;

            if (!this.value.toString().match(/^\d+\.?\d*$/))
            {
                error_message = lightchart_text.error_digitonly;
            }
            else if(this.value <= 0)
            {
                error_message = lightchart_text.error_nonzero;
            }

            // If not digit
            if (error_message)
            {
                error_message = error_message.replace(/\{\d+:INPUT\}/, this.previousSibling.innerHTML);
                $(this).after('<div class="errorfield">'+error_message+'</div>');

                valid = false;
                return valid;
            }
        }).end()
        .siblings().find('input[type=text]').each(function () {
            if (!this.value.toString().match(/^\d+\.?\d*$/)) {
                $(this).remove();
            }
        });

    return valid;
};

function listen_to_chart_element () {
    var current_hover_li = null;
    var form_chart_director = $('#form_chart_director');
    var chart_director_imageholder = document.getElementById('chart_director_imageholder');
    var chart_properties = $('#chart_properties');
    var chart_overlay_or_new = $('#chart_overlay_or_new');
    var lightchart_text = {};
    var lightchart_texts = $('#lightchart_texts').find('li');
    var selected_field_history = {};
    var chart_compare_underlying = $('#chart_compare_underlying');
    var chart_period = $('#chart_period');

    lightchart_texts.each(function()
    {
        lightchart_text[this.id] = this.innerHTML;
    });

    var instrument_content = $('#instrument-content');
    instrument_content.find('input[value='+chart_compare_underlying.find('li:first input[name=overlay]').val()+']').attr('checked', 'checked');
    $('#form_chart_director input[name=symbol]').val(chart_compare_underlying.find('li:first input[name=overlay]').val().replace(/-$/,''));
    draw_chart();
    rearrange_compare_underlying_list();

    var remove_hover = function () {
        current_hover_li.removeClass('hover').find('.menu-wrap-a .tm-a').unwrap().unwrap();
    };

    var popup_content = {};
    var item_on_focus = {};

    $('.drop-down')
        .on('mouseover', '.tm-li', function (event) {
            var target = $(event.target);

            if (!target.hasClass('.tm-li')) {
                target = target.parents('.tm-li');
            }

            current_hover_li = target;

            target
                .parents('.tm-ul').find('.menu-wrap-a .tm-a').unwrap().unwrap()
                .end().end()
                .siblings().removeClass('hover').end()
                .find('.tm-a')
                .wrap('<span class="menu-wrap-a"><span class="menu-wrap-b"></span></span>');
        })
        .on('mouseout', '.tm-li', function (event) {
            if (!current_hover_li.hasClass('hover')) {
                $(event.target).parents('.tm-ul').find('.menu-wrap-a .tm-a').unwrap().unwrap();
            }
        });

    var previous_selected_radio = {};
    $('#form_chart_director')
        .find('input[type=radio]').each(function(){
            if (this.checked) {
                previous_selected_radio[this.name] = this.id;
            }
        }).end()
        .on('click', 'input[name=period],input[name=interval]', function (event){
            var target = $(event.target);
            if (target.attr('name') == 'interval')
            {
                target = $(document.getElementById('pr_1')).attr('checked', 'checked');
                $('#settings-content').find('input[value=CLOSE]').attr('checked', 'checked');
            }

            draw_chart(function () {
                target
                    .parents('#chart_period').find('.button').removeClass('disabled')
                    .end().end()
                    .siblings('label').addClass('disabled').children().addClass('disabled');
                return true;
            });
        })
        .on('click', '#settings-content input,input[value=None]', function (){
            draw_chart();
        })
        .on('click', '#band-content input,#indicator-content input,#moving-average-content input,#instrument-content input', function (event) {
            var selected_value = event.target.value;
            var key = selected_value.replace(/-$/,'');
            var prefix = event.target.name;
            var selected_id = event.target.id;

            if (event.target.type.toLowerCase() == 'checkbox' && !event.target.checked) {
                $('#chart_compare_underlying').find('ul').find('li input[value^=' + $(this).val() + ']').parents('li').remove();
                $('#form_chart_director input[name=symbol]').val($('#chart_compare_underlying').find('li:first input[name=overlay]').val().replace(/-$/,''));
                draw_chart();
                return true;
            }

            if (event.target.checked){
                item_on_focus = event.target;
            }

            if (prefix == '__selsym') {
                var overlays = chart_compare_underlying.find('li');

                if (overlays.size() > 5) {
                    overlays.filter(':nth-child(2)').remove();
                }

                overlays
                    .filter(':last').after('<li>'+($(event.target).next().html())+'<input type="checkbox" checked="checked" value="'+selected_value+'-" name="overlay" /></li>');

                $('#form_chart_director input[name=symbol]').val(selected_value);
                rearrange_compare_underlying_list();
                remove_hover();
                draw_chart();
                return true;
            }

            if (typeof popup_content[key] == 'object') {
                popup_content[key].removeClass('invisible').data('related_input_name', prefix).data('related_input_id', selected_id);
                remove_hover();
                return true;
            }
            else {
                // Request for the properties box if not exist
                $.get(
                    form_chart_director.attr('action') + '&' + form_chart_director.serialize()+ '&getdesc='+key+ '&prefix='+prefix,
                    function (texts) {
                        if (!texts) {
                            draw_chart();
                            return false;
                        }

                        // Append the container into its chart properties container,
                        // which groups all the chart properties
                        popup_content[key] = $('<div class="popupbox">'+decodeURIComponent(texts)+'</div>').appendTo(chart_properties);
                        popup_content[key].removeClass('invisible').data('related_input_name', prefix).data('related_input_id', selected_id);
                    }
                );
            }
        })
        .on('click', 'div.popupbox .close-button', function(event){
            var popupbox = $(event.target).parents('div.popupbox').addClass('invisible');
            $('#'+previous_selected_radio[popupbox.data('related_input_name')]).attr('checked', 'checked');
            $(item_on_focus).removeAttr('checked');
        })
        .on('click', 'div.popupbox button[type=submit]', function (event){
            event.preventDefault();

            var popupbox = $(event.target).parents('div.popupbox');

            var valid = check_input_error(popupbox);

            if (valid)
            {
                previous_selected_radio[popupbox.data('related_input_name')] = popupbox.data('related_input_id');

                draw_chart(function (){
                    popupbox.addClass('invisible');
                });
            }

            item_on_focus = null;
        })
        .on('mouseover', '#chart_compare_underlying li', function (event) {
            $(event.target).addClass('hover').parents('li').addClass('hover');
        })
        .on('mouseout', '#chart_compare_underlying li', function (event) {
            $(event.target).removeClass('hover').parents('li').removeClass('hover');
        })
        .on('click', '#chart_overlay_or_new .draw-overlay', function (event){
            if (chart_overlay_or_new.find('input:checked').val() == 'overlay') {
                var overlays = chart_compare_underlying.find('li');

                if (overlays.size() > 5) {
                    overlays.filter(':nth-child(2)').remove();
                }

                overlays
                    .filter(':last').after(
                        '<li><a href="#">' +
                        chart_overlay_or_new.find('h4').html() +
                        '</a><input type="checkbox" checked="checked" value="'+previous_selected_radio[chart_overlay_or_new.data('related_input_name')]+'" name="overlay"></li>'
                    );

                chart_compare_underlying.find('li').each(function (index){
                    this.className = 'line_'+(index+1);
                });
            }
        });

    $('li.interval').hover(function () {
        $('#intraday_interval').show();
    }, function () {
        $('#intraday_interval').hide();
    });
}

var draw_chart = function (callback_after_complete) {
    if($("#chart_director_imageholder").length === 0){
        return;
    }

    var all_li = $('#chart_compare_underlying').find('li');
    if (all_li.length == 1) {
        $('#instrument-content').find('input:checked').attr('disabled', true);
    }

    var prn = parseInt(Math.random()*8989898, 10);
    var form_chart_director = $('#form_chart_director');
    var img_url = form_chart_director.attr('action') + '&' + form_chart_director.serialize()+'&cache='+parseInt(Math.random()*8989898, 10)+'&current_width='+get_container_width();
    // I know this is nasty and gross, but so is the problem.
    // If I thought we were never going to fix charting, I would try to do
    // this better. Feel free to punch me in the face.  -mwm (2011-09-08)
    var tick_url = img_url.replace('print_chart', 'getticker');
    $('#ticker').load(tick_url);
    var image = new Image();

    showLoadingImage($('#chart_director_imageholder'));

    image.src = img_url;

    // show the image directly, it was cached by the browser
    if (image.complete)
    {
        // Append image to the container
        chart_director_imageholder.innerHTML = '';
        chart_director_imageholder.appendChild(image);

        if (typeof callback_after_complete == 'function') {
            callback_after_complete();
        }
    }
    else
    {
        // Image error checking
        image.onerror = function (event)
        {
            chart_director_imageholder.innerHTML='<p>Chart couldn\'t be loaded. </p>';
        };

        // Image loaded successfully
        image.onload = function ()
        {
            chart_director_imageholder.innerHTML = '';
            chart_director_imageholder.appendChild(image);
            // The onload event always occurs in firefox 1.0 infinitely,
            // so clear the onload listener once the image is loaded
            this.onload = null;

            if (typeof callback_after_complete == 'function') {
                callback_after_complete();
            }
        };
    }
};

onLoad.queue_for_url(function() {
    listen_to_chart_element();
}, 'smartchart');

