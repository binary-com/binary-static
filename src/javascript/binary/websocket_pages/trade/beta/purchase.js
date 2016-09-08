/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

var Purchase_Beta = (function () {
    'use strict';

    var purchase_data = {};

    var display = function (details) {
        purchase_data = details;

        var receipt = details['buy'],
            passthrough = details['echo_req']['passthrough'],
            container = document.getElementById('contract_confirmation_container'),
            message_container = document.getElementById('confirmation_message'),
            heading = document.getElementById('contract_purchase_heading'),
            descr = document.getElementById('contract_purchase_descr'),
            barrier_element = document.getElementById('contract_purchase_barrier'),
            chart = document.getElementById('tick_chart'),
            brief = document.getElementById('contract_purchase_brief'),
            balance = document.getElementById('contract_purchase_balance'),
            payout = document.getElementById('contract_purchase_payout'),
            cost = document.getElementById('contract_purchase_cost'),
            profit = document.getElementById('contract_purchase_profit'),
            spots = document.getElementById('contract_purchase_spots'),
            confirmation_error = document.getElementById('confirmation_error'),
            contracts_list = document.getElementById('contracts_list'),
            button = document.getElementById('contract_purchase_button');

        var error = details['error'];
        var show_chart = !error && passthrough['duration']<=10 && passthrough['duration_unit']==='t' && (sessionStorage.formname === 'risefall' || sessionStorage.formname === 'higherlower' || sessionStorage.formname === 'asian');

        contracts_list.style.display = 'none';

        if (error) {
            container.style.display = 'block';
            message_container.hide();
            confirmation_error.show();
            confirmation_error.innerHTML = (/ClientUnwelcome/.test(error.code) ? error['message'] + '<a class="pjaxload" href="' + page.url.url_for('user/authenticatews') + '"> ' + text.localize('Authorise your account.' + '</a>') : error['message']);
        } else {
            var guideBtn = document.getElementById('guideBtn');
            if(guideBtn) {
                guideBtn.style.display = 'none';
            }
            container.style.display = 'block';
            message_container.show();
            confirmation_error.hide();

            $('#contract-values > div > div').each(function() {
                $(this).text('').removeAttr('class', '');
            });
            brief.textContent = $('#underlying option:selected').text() + ' / ' +
                StringUtil.toTitleCase(Contract_Beta.contractType()[Contract_Beta.form()][purchase_data.echo_req.passthrough.contract_type]) +
                (Contract_Beta.form() === 'digits' ? ' ' + purchase_data.echo_req.passthrough.barrier : '');

            var is_spread = (Contract_Beta.form() === 'spreads');
            if (is_spread) {
                $('#contract_purchase_profit_list, #contract_purchase_description_section').removeClass('gr-4 gr-8').addClass('gr-6');
            } else {
                $('#contract_purchase_profit_list').removeClass('gr-6').addClass('gr-4');
                $('#contract_purchase_description_section').removeClass('gr-6').addClass('gr-8');
            }
            heading.textContent = Content.localize().textContractConfirmationHeading;
            descr.textContent = receipt['longcode'];
            if (barrier_element) label_value(barrier_element, '', '', true);
            [].forEach.call(document.getElementsByClassName('contract_purchase_reference'), function(ref) {
                ref.textContent = Content.localize().textRef + ' ' + receipt['transaction_id'];
            });

            var payout_value, cost_value, profit_value;

            if(passthrough['basis'] === "payout"){
                payout_value = passthrough['amount'];
                cost_value = passthrough['ask-price'];
            }
            else{
                cost_value = passthrough['amount'];
                payout_value = receipt['payout'];
            }
            profit_value = Math.round((payout_value - cost_value)*100)/100;

            if(is_spread){
                label_value(payout, Content.localize().textStopLoss      , receipt.stop_loss_level  , true);
                label_value(cost  , Content.localize().textAmountPerPoint, receipt.amount_per_point);
                label_value(profit, Content.localize().textStopProfit    , receipt.stop_profit_level, true);
            } else {
                label_value(payout, Content.localize().textPayout, addComma(payout_value));
                label_value(cost  , Content.localize().textStake , addComma(cost_value));
                // label_value(profit, Content.localize().textContractConfirmationProfit, addComma(profit_value));
            }

            balance.textContent = Content.localize().textContractConfirmationBalance + ' ' + format_money(TUser.get().currency, Math.round(receipt['balance_after']*100)/100);

            if(show_chart){
                chart.show();
            }
            else{
                chart.hide();
            }

            if(Contract_Beta.form() === 'digits'){
                [].forEach.call(spots.childNodes, function(child) { child.innerHTML = '&nbsp;'; });
                spots.show();
            }
            else{
                spots.hide();
            }

            if(Contract_Beta.form() !== 'digits' && !show_chart){
                button.setAttribute('contract_id', receipt['contract_id']);
                descr.show();
                button.show();
                $('#confirmation_message .open_contract_detailsws').attr('contract_id', receipt['contract_id']).removeClass('invisible');
            }
            else{
                descr.hide();
                button.hide();
                $('#confirmation_message .open_contract_detailsws').addClass('invisible');
            }
        }

        if(show_chart){
            var contract_sentiment;
            if(passthrough['contract_type']==='CALL' || passthrough['contract_type']==='ASIANU'){
                contract_sentiment = 'up';
            }
            else{
                contract_sentiment = 'down';
            }

            //calculate number of decimals needed to display tick-chart according to the spot
            //value of the underlying
            var decimal_points = 2;
            var tick_spots = Tick.spots();
            var tick_spot_epochs = Object.keys(tick_spots);
            if ( tick_spot_epochs.length > 0 ) {
                var last_quote = tick_spots[tick_spot_epochs[0]].toString();

                if ( last_quote.indexOf(".") != -1 ) {
                    decimal_points = last_quote.split('.')[1].length;
                }
            }

            var barrier;
            if ( sessionStorage.getItem('formname') === 'higherlower' ) {
              barrier = passthrough.barrier;
            }

            WSTickDisplay_Beta.initialize({
                symbol:passthrough.symbol,
                barrier: barrier,
                number_of_ticks:passthrough.duration,
                previous_tick_epoch:receipt['start_time'],
                contract_category:sessionStorage.getItem('formname')==='asian' ? 'asian' : 'callput',
                display_symbol:Symbols.getName(passthrough.symbol),
                contract_start:receipt['start_time'],
                display_decimals: decimal_points,
                contract_sentiment:contract_sentiment,
                price:passthrough['ask-price'],
                payout:receipt['payout'],
                show_contract_result:1,
                width: $('#tick_chart').width(),
                is_trading_page: true
            });
            WSTickDisplay_Beta.spots_list = {};
        }
    };

    var update_spot_list = function(data){
        if($('#contract_purchase_spots:hidden').length){
            return;
        }

        var duration = purchase_data.echo_req && purchase_data.echo_req.passthrough ? purchase_data.echo_req.passthrough['duration'] : null;

        if(!duration){
            return;
        }

        var container  = document.getElementById('contract_purchase_spots'),
            tick_elem  = document.getElementById('current_tick_number'),
            spot_elem  = document.getElementById('current_tick_spot'),
            list_elem  = document.getElementById('last_digits_list');
        if(container) {
            tick_elem.innerHTML = spot_elem.innerHTML = list_elem.innerHTML = '&nbsp;';
        }
        for(var i = 1; i <= duration; i++) {
            var fragment = document.createElement('div');
            fragment.classList.add('gr-grow');

            var digit_elem = document.createElement('div');
            digit_elem.classList.add('digit');
            digit_elem.id = 'tick_digit_' + i;
            digit_elem.innerHTML = '&nbsp;';
            fragment.appendChild(digit_elem);

            var number_elem = document.createElement('div');
            number_elem.classList.add('number');
            number_elem.innerHTML = i;
            fragment.appendChild(number_elem);

            list_elem.appendChild(fragment);
        }

        var spots2 = Tick.spots();
        var epoches = Object.keys(spots2).sort(function(a,b){return a-b;});
        var tick_number = 0;

        var is_win = function(last_digit) {
            var contract_type = purchase_data.echo_req.passthrough.contract_type,
                barrier       = purchase_data.echo_req.passthrough.barrier;
            return ((contract_type === 'DIGITMATCH' && last_digit == barrier) ||
                    (contract_type === 'DIGITDIFF'  && last_digit != barrier) ||
                    (contract_type === 'DIGITEVEN'  && last_digit % 2 === 0 ) ||
                    (contract_type === 'DIGITODD'   && last_digit % 2       ) ||
                    (contract_type === 'DIGITOVER'  && last_digit > barrier ) ||
                    (contract_type === 'DIGITUNDER' && last_digit < barrier));
        };
        var replace = function(d) {
            last_digit = d;
            return '<span class="' + (is_win(d) ? 'profit' : 'loss') + '">' + d + '</span>';
        };
        for(var s=0; s<epoches.length; s++){
            var tick_d = {
                epoch: epoches[s],
                quote: spots2[epoches[s]]
            };

            if(isVisible(container) && tick_d.epoch && tick_d.epoch > purchase_data.buy.start_time){
                tick_number++;
                var last_digit;

                tick_elem.textContent = Content.localize().textTickResultLabel + ' ' + tick_number;
                spot_elem.innerHTML = tick_d.quote.replace(/\d$/, replace);

                var this_digit_elem = document.getElementById('tick_digit_' + tick_number);
                this_digit_elem.classList.add(is_win(last_digit) ? 'profit' : 'loss');
                this_digit_elem.textContent = last_digit;

                if(last_digit && duration === 1) {
                    var contract_status,
                        final_price,
                        pnl;

                    if (is_win(last_digit)) {
                        final_price = $('#contract_purchase_payout_value').attr('value');
                        pnl = $('#contract_purchase_cost_value').attr('value');
                        contract_status = Content.localize().textContractStatusWon;
                    } else {
                        final_price = 0;
                        pnl = -$('#contract_purchase_cost_value').attr('value');
                        contract_status = Content.localize().textContractStatusLost;
                    }

                    updatePurchaseStatus_Beta(final_price, pnl, contract_status);
                }

                duration--;
                if(!duration){
                    purchase_data.echo_req.passthrough['duration'] = 0;
                }
            }

        }

    };

    return {
        display: display,
        update_spot_list: update_spot_list
    };

})();
