var ViewPopupWS = (function() {
    "use strict";

    var contractID,
        contractType,
        contract,
        history,
        proposal,
        isSold,
        isSellClicked,
        chartStarted,
        tickForgotten,
        candleForgotten,
        chartUpdated;
    var $Container,
        $loading,
        btnView,
        popupboxID,
        wrapperID,
        winStatusID,
        hiddenClass;

    var init = function(button) {
        btnView         = button;
        contractID      = $(btnView).attr('contract_id');
        contractType    = '';
        contract        = {};
        history         = {};
        proposal        = {};
        isSold          = false;
        isSellClicked   = false;
        chartStarted    = false;
        tickForgotten   = false;
        candleForgotten = false;
        chartUpdated    = false;
        $Container      = '';
        popupboxID      = 'inpage_popup_content_box';
        wrapperID       = 'sell_content_wrapper';
        winStatusID     = 'contract_win_status';
        hiddenClass     = 'hidden';

        if (btnView) {
            ViewPopupUI.disable_button($(btnView));
            ViewPopupUI.cleanup(true);
        }

        getContract();

        setLoadingState(true);
    };

    var responseContract = function(response) {
        if(!response.proposal_open_contract || Object.keys(response.proposal_open_contract).length === 0) {
            showErrorPopup(response);
            return;
        }
        // In case of error such as legacy shortcode, this call is returning the error message
        // but no error field. To specify those cases, we check for other fields existence
        if(!response.proposal_open_contract.hasOwnProperty('shortcode')) {
            showErrorPopup(response, response.proposal_open_contract.validation_error);
            return;
        }

        $.extend(contract, response.proposal_open_contract);

        if(contract && contractType) {
            if (!document.getElementById(wrapperID)) return;
            ViewPopupWS[contractType + 'Update']();
            return;
        }

        // ----- Tick -----
        if(contract.hasOwnProperty('tick_count')) {
            contractType = 'tick';
            tickShowContract();
        }
        // ----- Spread -----
        else if(contract.shortcode.toUpperCase().indexOf('SPREAD') === 0) {
            contractType = 'spread';
            getTickHistory(contract.underlying, contract.date_start + 1, contract.date_start + 60, 0);

            var shortcode = contract.shortcode.toUpperCase();
            var details   = shortcode.replace(contract.underlying.toUpperCase() + '_', '').split('_');
            contract.per_point   = details[1];
            contract.stop_loss   = details[3];
            contract.stop_profit = details[4];
            contract.is_point    = details[5] === 'POINT';

            socketSend({
                "proposal"        : 1,
                "symbol"          : contract.underlying,
                "currency"        : contract.currency,
                "contract_type"   : details[0],
                "amount_per_point": contract.per_point,
                "stop_loss"       : contract.stop_loss,
                "stop_profit"     : contract.stop_profit,
                "stop_type"       : details[5].toLowerCase()
            });
        }
        // ----- Normal -----
        else {
            contractType = 'normal';
            normalShowContract();
        }
    };

    // ===== Contract: Tick =====
    var tickShowContract = function() {
        setLoadingState(false);

        ViewPopupUI.show_inpage_popup(
            $('<div/>', {id: wrapperID, class: popupboxID})
                .append($('<div/>', {class: 'popup_bet_desc drag-handle', text: contract.longcode}))
                .append($('<div/>', {id: 'tick_chart'}))
                .append($('<div/>', {id: winStatusID, class: hiddenClass})),
            'tick_popup'
        );

        tickUpdate();
    };

    var tickUpdate = function() {
        if(contract.is_expired) {
            showWinLossStatus((contract.sell_price || contract.bid_price) > 0);
        }
        if (!chartUpdated) {
             WSTickDisplay.updateChart('', contract);
             chartUpdated = true;
         }
    };

    // ===== Contract: Spread =====
    var spreadShowContract = function() {
        if(Object.keys(history).length === 0 || Object.keys(proposal).length === 0) {
            return;
        }

        setLoadingState(false);

        contract.is_up        = contract.shortcode['spread'.length] === 'U';
        contract.direction    = contract.is_up ? 1 : -1;
        contract.spread       = proposal.spread;
        contract.decPlaces    = ((/^\d+(\.\d+)?$/).exec(history.prices[0])[1] || '-').length - 1;
        contract.entry_level  = parseFloat(history.prices[0] * 1 + contract.direction * contract.spread / 2);

        spreadSetValues();

        if(!$Container) {
            $Container = spreadMakeTemplate();
        }

        $Container.find('#entry_level').text(contract.entry_level.toFixed(contract.decPlaces));
        $Container.find('#per_point').text((contract.is_up ? '+' : '-') + contract.per_point);

        spreadUpdate();
    };

    var spreadSetValues = function() {
        contract.is_ended          = contract.is_expired || contract.is_sold;
        contract.status            = text.localize(contract.is_ended ? 'Closed' : 'Open');
        contract.profit            = contract.sell_price ? parseFloat(contract.sell_price) - parseFloat(contract.buy_price) : parseFloat(contract.bid_price) - parseFloat(contract.ask_price);
        contract.profit_point      = contract.profit / contract.per_point;
        contract.stop_loss_level   = contract.entry_level + contract.stop_loss   / (contract.is_point ? 1 : contract.per_point) * (- contract.direction);
        contract.stop_profit_level = contract.entry_level + contract.stop_profit / (contract.is_point ? 1 : contract.per_point) * contract.direction;
    };

    var spreadUpdate = function() {
        spreadSetValues();

        containerSetText('status'           , contract.status, {'class': contract.is_ended ? 'loss' : 'profit'});
        containerSetText('stop_loss_level'  , contract.stop_loss_level.toFixed(contract.decPlaces));
        containerSetText('stop_profit_level', contract.stop_profit_level.toFixed(contract.decPlaces));
        containerSetText('pl_value'         , contract.profit.toFixed(2), {'class': contract.profit >= 0 ? 'profit' : 'loss'});
        containerSetText('pl_point'         , contract.profit_point.toFixed(2));

        if(!contract.is_ended) {
            contract.sell_level = contract.entry_level + contract.profit_point * contract.direction;
            containerSetText('sell_level', contract.sell_level.toFixed(contract.decPlaces));
        }
        else {
            spreadContractEnded(contract.profit >= 0);
        }

        sellSetVisibility(!isSellClicked && !contract.is_ended);
    };

    var spreadContractEnded = function(is_win) {
        contract.exit_level = contract.entry_level + contract.profit_point * contract.direction;
        $Container.find('#sell_level').parent('tr').addClass(hiddenClass);
        $Container.find('#exit_level').text(contract.exit_level.toFixed(contract.decPlaces)).parent('tr').removeClass(hiddenClass);
        sellSetVisibility(false);
        // showWinLossStatus(is_win);
    };

    var spreadMakeTemplate = function() {
        $Container = $('<div/>');
        $Container.prepend($('<div/>', {id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: text.localize('Contract Information')}));

        var $table = $('<table><tbody></tbody></table>');
        var tbody = spreadRow('Status'              , 'status', (contract.is_ended ? 'loss' : 'profit')) +
                    spreadRow('Entry Level'         , 'entry_level') +
                    spreadRow('Exit Level'          , 'exit_level', '', '', !contract.is_ended) +
                    spreadRow('Stop Loss Level'     , 'stop_loss_level') +
                    spreadRow('Stop Profit Level'   , 'stop_profit_level') +
                    spreadRow('Current Level'       , 'sell_level', '', '', contract.is_ended) +
                    spreadRow('Amount Per Point'    , 'per_point') +
                    spreadRow('Profit/Loss'         , 'pl_value', (contract.profit >= 0 ? 'profit' : 'loss'), ' (' + contract.currency + ')') +
                    spreadRow('Profit/Loss (points)', 'pl_point');

        $table.find('tbody').append(tbody);
        $Container.append(
            $('<div/>', {id: wrapperID})
                .append($('<div/>', {id: 'spread_table'}).append($table))
                .append($('<div/>', {id: 'errMsg', class: 'notice-msg ' + hiddenClass}))
                .append($('<div/>', {id: winStatusID, class: hiddenClass}))
                .append($('<div/>', {id: 'contract_sell_wrapper', class: hiddenClass}))
        );

        ViewPopupUI.show_inpage_popup('<div class="' + popupboxID + '">' + $Container.html() + '</div>', 'spread_popup', '#sell_bet_desc, #sell_content_wrapper');

        return $('#' + wrapperID);
    };

    var spreadRow = function(label, id, classname, label_no_localize, isHidden) {
        return '<tr' + (isHidden ? ' class="' + hiddenClass + '"' : '') + '><td>' + text.localize(label) + (label_no_localize || '') + '</td><td' + (id ? ' id="' + id + '"' : '') + (classname ? ' class="' + classname + '"' : '') + '></td></tr>';
    };

    // ===== Contract: Normal =====
    var normalShowContract = function() {
        setLoadingState(false);

        if(!$Container) {
            $Container = normalMakeTemplate();
        }

        containerSetText('trade_details_contract_id'   , contract.contract_id);
        containerSetText('trade_details_start_date'    , epochToDateTime(contract.date_start));
        containerSetText('trade_details_end_date'      , epochToDateTime(contract.date_expiry));
        containerSetText('trade_details_purchase_price', contract.currency + ' ' + parseFloat(contract.buy_price).toFixed(2));

        normalUpdateTimers();
        normalUpdate();
    };

    var normalUpdate = function() {
        var finalPrice = contract.sell_price || contract.bid_price,
            is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start,
            user_sold  = contract.sell_spot_time && contract.sell_spot_time < contract.date_expiry,
            is_ended   = contract.is_expired || contract.is_sold || user_sold;

        if(contract.high_barrier) {
            containerSetText('trade_details_barrier'    , contract.high_barrier , '', true);
            containerSetText('trade_details_barrier_low', contract.low_barrier  , '', true);
        } else if(contract.barrier) {
            containerSetText('trade_details_barrier'    , contract.entry_tick_time ? contract.barrier : '-', '', true);
        }

        var currentSpot = user_sold ? contract.sell_spot : (is_ended ? contract.exit_tick : contract.current_spot);

        containerSetText('trade_details_ref_id'          , contract.transaction_ids.buy + (contract.transaction_ids.sell ? ' - ' + contract.transaction_ids.sell : ''));
        containerSetText('trade_details_current_date'    , epochToDateTime(!is_ended ? contract.current_spot_time : (user_sold ? contract.sell_spot_time : contract.exit_tick_time)));
        containerSetText('trade_details_current_spot'    , currentSpot || text.localize('not available'));
        containerSetText('trade_details_indicative_price', contract.currency + ' ' + parseFloat(is_ended ? (contract.sell_price || contract.bid_price) : contract.bid_price).toFixed(2));

        var profit_loss = finalPrice - contract.buy_price;
        var percentage  = (profit_loss * 100 / contract.buy_price).toFixed(2);
        containerSetText('trade_details_profit_loss', contract.currency + ' ' + parseFloat(profit_loss).toFixed(2) + '<span>(' + (percentage > 0 ? '+' : '') + percentage + '%' + ')</span>', {'class': (profit_loss >= 0 ? 'profit' : 'loss')});

        if(!is_started) {
            containerSetText('trade_details_entry_spot', '-');
            containerSetText('trade_details_message'   , text.localize('Contract is not started yet'));
        }
        else{
            if(contract.entry_spot > 0) {
                containerSetText('trade_details_entry_spot', contract.entry_spot);
            }
            containerSetText('trade_details_message', contract.validation_error || '&nbsp;');
        }

        if(!chartStarted) {
            if (!tickForgotten) {
              tickForgotten = true;
              socketSend({"forget_all":"ticks"});
            } else {
              Highchart.show_chart(contract, 'update');
              if (contract.entry_tick_time) {
                chartStarted = true;
              }
            }
        }

        if(!isSold && user_sold) {
            isSold = true;
            Highchart.show_chart(contract, 'update');
        }
        if(is_ended) {
            normalContractEnded(parseFloat(profit_loss) >= 0);
            if(contract.is_valid_to_sell && contract.is_expired && !contract.is_sold && !isSellClicked) {
                ViewPopupUI.forget_streams();
                sellExpired();
            }
            Highchart.show_chart(contract, 'update');
        }

        sellSetVisibility(!isSellClicked && !isSold && !is_ended && +contract.is_valid_to_sell === 1);
        contract.chart_validation_error = contract.validation_error;
        contract.validation_error = '';
    };

    var normalUpdateTimers = function() {
        var update_time = function() {
            var now = Math.max(Math.ceil((window.time || 0) / 1000), contract.current_spot_time || 0);
            containerSetText('trade_details_live_date' , epochToDateTime(now));
            showLocalTimeOnHover('#trade_details_live_date');

            var is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start,
                is_ended   = contract.is_expired || contract.is_sold;
            if(!is_started || is_ended || now >= contract.date_expiry) {
                containerSetText('trade_details_live_remaining', '-');
            } else {
                var remained = contract.date_expiry - now,
                    day_seconds = 24 * 60 * 60,
                    days = 0;
                if(remained > day_seconds) {
                    days = Math.floor(remained / day_seconds);
                    remained = remained % day_seconds;
                }
                containerSetText('trade_details_live_remaining',
                    (days > 0 ? days + ' ' + text.localize(days > 1 ? 'days' : 'day') + ', ' : '') +
                    moment((remained) * 1000).utc().format('HH:mm:ss'));
            }
        };
        update_time();

        clearInterval(window.ViewPopupTimerInterval);
        window.ViewPopupTimerInterval = setInterval(update_time, 500);
    };

    var normalContractEnded = function(is_win) {
        containerSetText('trade_details_current_title'   , text.localize(contract.sell_spot_time < contract.date_expiry ? 'Contract Sold' : 'Contract Expiry'));
        containerSetText('trade_details_spot_label'      , text.localize('Exit Spot'));
        containerSetText('trade_details_spottime_label'  , text.localize('Exit Spot Time'));
        containerSetText('trade_details_indicative_label', text.localize('Price'));
        containerSetText('trade_details_message'         , '&nbsp;', {'epoch_time': ''});
        sellSetVisibility(false);
        // showWinLossStatus(is_win);
    };

    var normalMakeTemplate = function() {
        $Container = $('<div/>').append($('<div/>', {id: wrapperID}));
        $Container.prepend($('<div/>', {id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: contract.longcode}));
        var $sections = $('<div/>').append($('<div id="sell_details_chart_wrapper" class="grd-grid-8 grd-grid-mobile-12"></div><div id="sell_details_table" class="grd-grid-4 grd-grid-mobile-12 drag-handle"></div>'));

        $sections.find('#sell_details_table').append($(
            '<table>' +
                '<tr><th colspan="2">' + text.localize('Contract Information') + '</th></tr>' +
                    normalRow('Contract ID',    '', 'trade_details_contract_id') +
                    normalRow('Reference ID',   '', 'trade_details_ref_id') +
                    normalRow('Start Time',     '', 'trade_details_start_date') +
                    normalRow('End Time',       '', 'trade_details_end_date') +
                    normalRow('Remaining Time', '', 'trade_details_live_remaining') +
                    normalRow('Entry Spot',     '', 'trade_details_entry_spot') +
                    normalRow(contract.high_barrier ? 'High Barrier' : 'Barrier', '', 'trade_details_barrier'    , true) +
                    (contract.low_barrier ? normalRow('Low Barrier',              '', 'trade_details_barrier_low', true) : '') +
                    normalRow('Purchase Price', '', 'trade_details_purchase_price') +
                '<tr><th colspan="2" id="trade_details_current_title">' + text.localize('Current') + '</th></tr>' +
                    normalRow('Spot',           'trade_details_spot_label'    , 'trade_details_current_spot') +
                    normalRow('Spot Time',      'trade_details_spottime_label', 'trade_details_current_date') +
                    normalRow('Current Time',   '', 'trade_details_live_date') +
                    normalRow('Indicative',     'trade_details_indicative_label', 'trade_details_indicative_price') +
                    normalRow('Profit/Loss',    '', 'trade_details_profit_loss') +
                '<tr><td colspan="2" class="last_cell" id="trade_details_message">&nbsp;</td></tr>' +
            '</table>' +
            '<div id="errMsg" class="notice-msg hidden"></div>' +
            '<div id="trade_details_bottom"><div id="contract_sell_wrapper" class="' + hiddenClass + '"></div><div id="contract_sell_message"></div><div id="contract_win_status" class="' + hiddenClass + '"></div></div>'
        ));

        $sections.find('#sell_details_chart_wrapper').html('<div id="live_chart_form_wrapper" class="grd-grid-12"></div>' +
            '<div class="chart-notice"><div class="notice" id="delayed_feed_notice" style="display: none;">Charting for this underlying is delayed</div><div class="notice" id="not_available_notice" style="display: none;">Charting is not available for this underlying</div></div>' +
            '<div id="analysis_live_chart" class="live_chart_wrapper grd-grid-12"><div>');

        $Container.find('#' + wrapperID)
            .append($sections.html())
            .append($('<div/>', {id: 'errMsg', class: 'notice-msg ' + hiddenClass}));

        ViewPopupUI.show_inpage_popup('<div class="' + popupboxID + '">' + $Container.html() + '</div>', '', '#sell_bet_desc, #sell_details_table');

        return $('#' + wrapperID);
    };

    var normalRow = function(label, label_id, value_id, isHidden) {
        return '<tr' + (isHidden ? ' class="' + hiddenClass + '"' : '') + '><td' + (label_id ? ' id="' + label_id + '"' : '') + '>' + text.localize(label) + '</td><td' + (value_id ? ' id="' + value_id + '"' : '') + '></td></tr>';
    };

    var normalSetVisibleRow = function(child_id, isVisible) {
        var $row = $('#' + child_id).parent('tr');
        if(isVisible) $row.removeClass(hiddenClass);
        else $row.addClass(hiddenClass);
    };

    var epochToDateTime = function(epoch) {
        return moment.utc(epoch * 1000).format('YYYY-MM-DD HH:mm:ss');
    };

    // ===== Tools =====
    var containerSetText = function(id, text, attributes, isVisible) {
        if(!$Container || $Container.length === 0) {
            $Container = $('#' + wrapperID);
        }

        var $target = $Container.find('#' + id);
        if($target && $target.length > 0) {
            $target.html(text);
            if(attributes && Object.keys(attributes).length > 0) {
                $target.attr(attributes);
            }
            if(isVisible) $target.parent('tr').removeClass(hiddenClass);
        }
    };

    var showWinLossStatus = function(isWin) {
        containerSetText(
            winStatusID,
            text.localize('This contract has ' + (isWin ? 'WON' : 'LOST')),
            {class: isWin ? 'won' : 'lost'}
        );
    };

    var setLoadingState = function(showLoading) {
        if(showLoading) {
            $loading = $('#trading_init_progress');
            if($loading.length) {
                $loading.show();
            }
        }
        else {
            if($loading.length) {
                $loading.hide();
            }
            if (btnView) {
                ViewPopupUI.enable_button($(btnView));
            }
        }
    };

    var showMessagePopup = function(message, title, msgClass) {
        setLoadingState(false);
        var $con = $('<div/>');
        $con.prepend($('<div/>', {id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: text.localize(title)}));
        $con.append(
            $('<div/>', {id: wrapperID})
                .append($('<div/>', {class: msgClass, html: text.localize(message)}))
        );
        ViewPopupUI.show_inpage_popup('<div class="' + popupboxID + '">' + $con.html() + '</div>', 'message_popup', '#sell_bet_desc, #sell_content_wrapper');
    };

    var showErrorPopup = function(response, message) {
        if(!message || message.length === 0) {
            message = 'Sorry, an error occurred while processing your request.';
        }
        showMessagePopup(text.localize(message), 'There was an error', 'notice-msg');
        console.log(response);
    };

    var sellSetVisibility = function(show) {
        var sellWrapperID = 'sell_at_market_wrapper',
            sellButtonID  = 'sell_at_market';
        var isExist = $Container.find('#' + sellWrapperID).length > 0;
        if(show === true) {
            if(!isExist) {
                if(contractType === 'spread') {
                    $Container.find('#contract_sell_wrapper').removeClass(hiddenClass).append(
                        $('<p/>', {id: sellWrapperID, class: 'button'})
                            .append($('<button/>', {id: sellButtonID, class: 'button', text: text.localize('Sell')}))
                    );
                }
                else {
                    $Container.find('#contract_sell_wrapper').removeClass(hiddenClass).append($('<div id="' + sellWrapperID + '"><span class="button"><button id="' + sellButtonID + '" class="button">' + text.localize('Sell at market') + '</button></span>' +
                        '<div class="note"><strong>' + text.localize('Note') + ':</strong> ' + text.localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.') + '</div>'));
                }
                $Container.find('#' + sellButtonID).unbind('click').click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    ViewPopupUI.forget_streams();
                    isSellClicked = true;
                    sellSetVisibility(false);
                    sellContract();
                });
            }
        }
        else {
            if(isExist) {
                $Container.find('#' + sellButtonID).unbind('click');
                $Container.find('#' + sellWrapperID).remove();
            }
        }
    };

    // ===== Requests & Responses =====
    // ----- Get Contract -----
    var getContract = function(option) {
        if(contractID) {
            ViewPopupUI.forget_streams();
            var req = {
              "proposal_open_contract": 1,
              "contract_id": contractID,
              "subscribe": 1
            };
            if (option === 'no-subscribe') delete req.subscribe;
            socketSend(req);
        }
    };

    // ----- Sell Expired -----
    var sellExpired = function(passthrough) {
        var req = {"sell_expired": 1, passthrough: {}};
        if(passthrough && Object.keys(passthrough).length > 0) {
            req.passthrough = passthrough;
        }
        socketSend(req);
    };

    var responseSellExpired = function(response) {
        getContract();
    };

    // ----- Sell Contract -----
    var sellContract = function(price, passthrough) {
        if(!price) {
            price = 0;
        }
        var req = {"sell": contractID, "price": price, passthrough: {}};
        if(passthrough && Object.keys(passthrough).length > 0) {
            req.passthrough = passthrough;
        }
        socketSend(req);
    };

    var responseSell = function(response) {
        if(response.hasOwnProperty('error')) {
            if(response.error.code === 'NoOpenPosition') {
                getContract();
            }
            else {
                $Container.find('#errMsg').text(response.error.message).removeClass(hiddenClass);
            }
            return;
        }
        if(contractType === 'spread') {
            sellSetVisibility(false);
            getContract();
        }
        else if(contractType === 'normal') {
            sellSetVisibility(false);
            if(isSellClicked) {
                containerSetText('contract_sell_message',
                    text.localize('You have sold this contract at [_1] [_2]').replace('[_1]', contract.currency).replace('[_2]', response.sell.sold_for) +
                    '<br />' +
                    text.localize('Your transaction reference number is [_1]').replace('[_1]', response.sell.transaction_id)
                );
            }
            getContract('no-subscribe');
        }
    };

    // ----- Tick History -----
    var getTickHistory = function(symbol, start, end, count, passthrough, granularity) {
        var req = {"ticks_history": symbol, "start": start, "end": end, "count": count, passthrough: {}};
        if(!start) {
            delete(req['start']);
        }
        if(!count || count === 0) {
            delete(req['count']);
        }
        if(passthrough && Object.keys(passthrough).length > 0) {
            req.passthrough = passthrough;
        }
        req.passthrough.contract_id = contractID;
        if(granularity > 0) {
            req.style = 'candles';
            req.granularity = granularity;
        }
        socketSend(req);
    };

    var responseHistory = function(response) {
        if(response.hasOwnProperty('error')) {
            // Sometimes when tick data or feed is not ready, the tick_history response returns with unclear error
            showErrorPopup(response);
            return;
        }
        if(response.echo_req.passthrough && response.echo_req.passthrough.contract_id != contractID) {
            return;
        }

        switch(contractType) {
            case 'spread':
                history = response.history;
                spreadShowContract();
                break;
        }
    };

    // ----- Proposal -----
    var responseProposal = function(response) {
        if(response.hasOwnProperty('error')) {
            showErrorPopup(response);
            return;
        }
        if(response.proposal.hasOwnProperty('id')) {
            BinarySocket.send({"forget": response.proposal.id});
        }
        if(contractType === 'spread' && Object.keys(proposal).length === 0) {
            proposal = response.proposal;
            spreadShowContract();
        }
    };

    // ===== Dispatch =====
    var storeSubscriptionID = function(id, option) {
        if(!window.stream_ids && !option) {
            window.stream_ids = [];
        }
        if (!window.chart_stream_ids && option) {
            window.chart_stream_ids = [];
        }
        if(!option && id && id.length > 0 && $.inArray(id, window.stream_ids) < 0) {
            window.stream_ids.push(id);
        } else if(option && id && id.length > 0 && $.inArray(id, window.chart_stream_ids) < 0) {
            window.chart_stream_ids.push(id);
        }
    };

    var socketSend = function(req) {
        if(!req.hasOwnProperty('passthrough')) {
            req.passthrough = {};
        }
        req.passthrough['dispatch_to'] = 'ViewPopupWS';
        BinarySocket.send(req);
    };

    var dispatch = function(response) {
        if(response.echo_req.hasOwnProperty('passthrough') && response.echo_req.passthrough.dispatch_to === 'ViewPopupWS') {
            switch(response.msg_type) {
                case 'proposal_open_contract':
                    if(response.proposal_open_contract && response.proposal_open_contract.contract_id == contractID) {
                        storeSubscriptionID(response.proposal_open_contract.id);
                        responseContract(response);
                    }
                    break;
                case 'history':
                case 'candles':
                case 'ticks_history':
                    responseHistory(response);
                    break;
                case 'proposal':
                    responseProposal(response);
                    break;
                case 'sell':
                    responseSell(response);
                    break;
                case 'sell_expired':
                    responseSellExpired(response);
                    break;
                case 'forget_all':
                    if (response.echo_req.forget_all === 'ticks' && !candleForgotten) {
                      candleForgotten = true;
                      socketSend({"forget_all":"candles"});
                    } else if (response.echo_req.forget_all === 'candles') {
                      Highchart.show_chart(contract);
                      if (contract.entry_tick_time) {
                        chartStarted = true;
                      }
                    }
                    break;
                default:
                    break;
            }
            showLocalTimeOnHover('#trade_details_start_date');
            showLocalTimeOnHover('#trade_details_end_date');
            showLocalTimeOnHover('#trade_details_current_date');
            showLocalTimeOnHover('#trade_details_live_date');
        }
    };

    return {
        init                : init,
        dispatch            : dispatch,
        tickUpdate          : tickUpdate,
        spreadUpdate        : spreadUpdate,
        normalUpdate        : normalUpdate,
        storeSubscriptionID : storeSubscriptionID
    };
}());


pjax_config_page("profit_tablews|statementws|openpositionsws|trading", function() {
    return {
        onLoad: function() {
            $('#profit-table-ws-container, #statement-ws-container, #portfolio-table, #contract_confirmation_container')
                .on('click', '.open_contract_detailsws', function (e) {
                    e.preventDefault();
                    ViewPopupWS.init(this);
                });
        }
    };
});
