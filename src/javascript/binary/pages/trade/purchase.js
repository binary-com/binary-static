/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

var Purchase = (function () {
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
            reference = document.getElementById('contract_purchase_reference'),
            chart = document.getElementById('tick_chart'),
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
            confirmation_error.innerHTML = (/ClientUnwelcome/.test(error.code) ? error['message'] + '<a href="' + page.url.url_for('cashier/authenticatews') + '"> ' + text.localize('Authorise your account.' + '</a>') : error['message']);
        } else {
            var guideBtn = document.getElementById('guideBtn');
            if(guideBtn) {
                guideBtn.style.display = 'none';
            }
            container.style.display = 'table-row';
            message_container.show();
            confirmation_error.hide();

            heading.textContent = Content.localize().textContractConfirmationHeading;
            descr.textContent = receipt['longcode'];
            reference.textContent = Content.localize().textContractConfirmationReference + ' ' + receipt['transaction_id'];

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

            if(sessionStorage.getItem('formname')==='spreads'){
                payout.innerHTML = Content.localize().textStopLoss + ' <p>' + receipt.stop_loss_level + '</p>';
                cost.innerHTML = Content.localize().textAmountPerPoint + ' <p>' + receipt.amount_per_point + '</p>';
                profit.innerHTML = Content.localize().textStopProfit + ' <p>' + receipt.stop_profit_level + '</p>';
            }
            else {
                payout.innerHTML = Content.localize().textContractConfirmationPayout + ' <p>' + payout_value + '</p>';
                cost.innerHTML = Content.localize().textContractConfirmationCost + ' <p>' + cost_value + '</p>';
                profit.innerHTML = Content.localize().textContractConfirmationProfit + ' <p>' + profit_value + '</p>';
            }

            balance.textContent = Content.localize().textContractConfirmationBalance + ' ' + TUser.get().currency + ' ' + Math.round(receipt['balance_after']*100)/100;

            if(show_chart){
                chart.show();
            }
            else{
                chart.hide();
            }

            if(Contract.form() === 'digits'){
                spots.textContent = '';
                spots.className = '';
                spots.show();
            }
            else{
                spots.hide();
            }

            if(Contract.form() !== 'digits' && !show_chart){
                button.textContent = Content.localize().textContractConfirmationButton;
                button.setAttribute('contract_id', receipt['contract_id']);
                button.show();
                $('.open_contract_detailsws').attr('contract_id', receipt['contract_id']).removeClass('invisible');
            }
            else{
                button.hide();
                $('.open_contract_detailsws').addClass('invisible');
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

            WSTickDisplay.initialize({
                symbol:passthrough.symbol,
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
                width: $('#confirmation_message').width(),
            });
            WSTickDisplay.spots_list = {};
        }
    };

    var update_spot_list = function(data){

        if($('#contract_purchase_spots:hidden').length){
            return;
        }

        var duration = purchase_data.echo_req.passthrough['duration'];

        if(!duration){
            return;
        }

        var spots = document.getElementById('contract_purchase_spots');
        var spots2 = Tick.spots();
        var epoches = Object.keys(spots2).sort(function(a,b){return a-b;});
        spots.textContent = '';

        var replace = function(d){d1 = d; return '<b>'+d+'</b>';};
        for(var s=0; s<epoches.length; s++){
            var tick_d = {
                epoch: epoches[s],
                quote: spots2[epoches[s]]
            };

            if(isVisible(spots) && tick_d.epoch && tick_d.epoch > purchase_data.buy.start_time){
                var fragment = document.createElement('div');
                fragment.classList.add('row');

                var el1 = document.createElement('div');
                el1.classList.add('col');
                el1.textContent = Content.localize().textTickResultLabel + " " + (spots.getElementsByClassName('row').length+1);
                fragment.appendChild(el1);

                var el2 = document.createElement('div');
                el2.classList.add('col');
                var date = new Date(tick_d.epoch*1000);
                var hours = date.getUTCHours() < 10 ? '0'+date.getUTCHours() : date.getUTCHours();
                var minutes = date.getUTCMinutes() < 10 ? '0'+date.getUTCMinutes() : date.getUTCMinutes();
                var seconds = date.getUTCSeconds() < 10 ? '0'+date.getUTCSeconds() : date.getUTCSeconds();
                el2.textContent = hours+':'+minutes+':'+seconds;
                fragment.appendChild(el2);

                var d1;
                var tick = tick_d.quote.replace(/\d$/,replace);
                var el3 = document.createElement('div');
                el3.classList.add('col');
                el3.innerHTML = tick;
                fragment.appendChild(el3);

                spots.appendChild(fragment);
                spots.scrollTop = spots.scrollHeight;

                if(d1 && duration===1){
                    var contract_status,
                        final_price,
                        pnl;

                    if  (  purchase_data.echo_req.passthrough.contract_type==="DIGITMATCH" && d1==purchase_data.echo_req.passthrough.barrier || purchase_data.echo_req.passthrough.contract_type==="DIGITDIFF" && d1!=purchase_data.echo_req.passthrough.barrier || purchase_data.echo_req.passthrough.contract_type==="DIGITEVEN" && d1%2===0 || purchase_data.echo_req.passthrough.contract_type==="DIGITODD" && d1%2 || purchase_data.echo_req.passthrough.contract_type==="DIGITOVER" && d1>purchase_data.echo_req.passthrough.barrier || purchase_data.echo_req.passthrough.contract_type==="DIGITUNDER" && d1<purchase_data.echo_req.passthrough.barrier){
                        spots.className = 'won';
                        final_price = $('#contract_purchase_payout p').text();
                        pnl = $('#contract_purchase_cost p').text();
                        contract_status = Content.localize().textContractStatusWon;
                    }
                    else{
                        spots.className = 'lost';
                        final_price = 0;
                        pnl = -$('#contract_purchase_cost p').text();
                        contract_status = Content.localize().textContractStatusLost;
                    }

                    updatePurchaseStatus(final_price, pnl, contract_status);
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
