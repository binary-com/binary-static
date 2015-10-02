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
            form_data = details['echo_req']['form_data'],
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
            contracts_list = document.getElementById('contracts_list');

        var error = details['error'];
        var show_chart = !error && form_data['duration']<=10 && form_data['duration_unit']==='t' && (sessionStorage.formname === 'risefall' || sessionStorage.formname === 'higherlower');

        container.style.display = 'block';
        contracts_list.style.display = 'none';

        if (error) {
            message_container.hide();
            confirmation_error.show();
            confirmation_error.textContent = error['message'];
        } else {
            message_container.show();
            confirmation_error.hide();

            heading.textContent = Content.localize().textContractConfirmationHeading;
            descr.textContent = receipt['longcode'];

            var payout_value, cost_value, profit_value;
            if(form_data.basis === "payout"){
                payout_value = form_data.amount_val;
                cost_value = form_data['ask-price'];
            }
            else{
                cost_value = form_data.amount_val;
                var match = receipt['longcode'].match(/\d+\.\d\d/);
                payout_value = match[0];
            }
            profit_value = Math.round((payout_value - cost_value)*100)/100;

            payout.innerHTML = Content.localize().textContractConfirmationPayout + ' <p>' + payout_value + '</p>';
            cost.innerHTML = Content.localize().textContractConfirmationCost + ' <p>' + cost_value + '</p>';
            profit.innerHTML = Content.localize().textContractConfirmationProfit + ' <p>' + profit_value + '</p>';

            balance.textContent = Content.localize().textContractConfirmationBalance + ' ' + Math.round(receipt['balance_after']*100)/100;

            if(show_chart){
                chart.show();
            }
            else{
                chart.hide();
            }

            if(sessionStorage.formname === 'digits'){
                spots.textContent = '';
                spots.show();
            }
            else{
                spots.hide();
            }
            
        }

        if(show_chart){
            TickDisplay.initialize({
                "symbol":form_data.symbol,
                "number_of_ticks":form_data.duration,
                "previous_tick_epoch":receipt['start_time'],
                "contract_category":"callput",

                "display_symbol":Symbols.getName(form_data.symbol),
                "contract_start":receipt['start_time'],
                "decimal":3,
                "contract_sentiment":(form_data['contract_type']==='CALL' ? 'up' : 'down'),
                "price":form_data['ask-price'],
                "payout":form_data['amount_val'],
                "show_contract_result":1
            });
        }
    };

    var update_spot_list = function(data){
        var spots = document.getElementById('contract_purchase_spots');
        if(isVisible(spots) && purchase_data.echo_req.form_data.duration && data.tick.epoch && data.tick.epoch > purchase_data.buy.start_time){
            var fragment = document.createElement('div');
            fragment.classList.add('row');

            var el1 = document.createElement('div');
            el1.classList.add('col');
            el1.textContent = 'Tick '+ (spots.getElementsByClassName('row').length+1);
            fragment.appendChild(el1);

            var el2 = document.createElement('div');
            el2.classList.add('col');
            var date = new Date(data.tick.epoch*1000);
            var hours = date.getUTCHours() < 10 ? '0'+date.getUTCHours() : date.getUTCHours();
            var minutes = date.getUTCMinutes() < 10 ? '0'+date.getUTCMinutes() : date.getUTCMinutes();
            var seconds = date.getUTCSeconds() < 10 ? '0'+date.getUTCSeconds() : date.getUTCSeconds();
            el2.textContent = hours+':'+minutes+':'+seconds;
            fragment.appendChild(el2);

            var d1;
            var tick = data.tick.quote.replace(/\d$/,function(d){d1 = d; return '<b>'+d+'</b>';});
            var el3 = document.createElement('div');
            el3.classList.add('col');
            el3.innerHTML = tick;
            fragment.appendChild(el3);

            spots.appendChild(fragment);
            
            if(d1){
                var contract_status;
                if(d1==purchase_data.echo_req.form_data.barrier){
                    spots.className = 'won';
                    contract_status = 'This contract won';
                }
                else{
                    spots.className = 'lost';
                    contract_status = 'This contract lost';
                }
                document.getElementById('contract_purchase_heading').textContent = text.localize(contract_status);
            }

            purchase_data.echo_req.form_data.duration--;
        }
    };

    return {
        display: display,
        update_spot_list: update_spot_list
    };

})();
