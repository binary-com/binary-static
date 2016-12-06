var showLocalTimeOnHover = require('../../../base/utility').showLocalTimeOnHover;
var toJapanTimeIfNeeded  = require('../../../base/utility').toJapanTimeIfNeeded;
var objectNotEmpty       = require('../../../base/utility').objectNotEmpty;
var format_money         = require('../../../common_functions/currency_to_symbol').format_money;
// var japanese_client      = require('../../../common_functions/country_base').japanese_client;
var MBPrice              = require('../../mb_trade/mb_price').MBPrice;
var ViewPopupUI          = require('./view_popup_ui').ViewPopupUI;
var moment               = require('moment');
var State                = require('../../../base/storage').State;
var Highchart            = require('../../trade/charts/highchartws').Highchart;
var WSTickDisplay        = require('../../trade/tick_trade').WSTickDisplay;

var ViewPopupWS = (function() {
    'use strict';

    var contractID,
        contractType,
        contract,
        isSold,
        isSellClicked,
        chartStarted,
        tickForgotten,
        candleForgotten,
        corporateActionEvent,
        corporateActionSent,
        chartUpdated;
    var $Container,
        $loading,
        btnView,
        popupboxID,
        wrapperID,
        winStatusID,
        hiddenClass;

    var init = function(button) {
        btnView = button;
        contractID = $(btnView).attr('contract_id');
        contractType = '';
        contract = {};
        isSold = false;
        isSellClicked = false;
        chartStarted = false;
        tickForgotten = false;
        candleForgotten = false;
        chartUpdated = false;
        corporateActionEvent = false;
        corporateActionSent = false;
        $Container = '';
        popupboxID = 'inpage_popup_content_box';
        wrapperID = 'sell_content_wrapper';
        winStatusID = 'contract_win_status';
        hiddenClass = 'hidden';

        if (btnView) {
            ViewPopupUI.disable_button($(btnView));
            ViewPopupUI.cleanup(true);
        }

        getContract();

        setLoadingState(true);
    };

    var responseContract = function(response) {
        if (!response.proposal_open_contract || !objectNotEmpty(response.proposal_open_contract)) {
            showErrorPopup(response);
            return;
        }
        // In case of error such as legacy shortcode, this call is returning the error message
        // but no error field. To specify those cases, we check for other fields existence
        if (!response.proposal_open_contract.hasOwnProperty('shortcode')) {
            showErrorPopup(response, response.proposal_open_contract.validation_error);
            return;
        }

        $.extend(contract, response.proposal_open_contract);

        if (contract && contractType) {
            if (!document.getElementById(wrapperID)) return;
            ViewPopupWS[contractType + 'Update']();
            return;
        }

        // ----- Corporate Action -----
        if (contract.has_corporate_actions && !corporateActionSent) {
            corporateActionSent = true;
            getCorporateActions();
        }

        // ----- Spread -----
        if (contract.shortcode.toUpperCase().indexOf('SPREAD') === 0) {
            contractType = 'spread';
            spreadShowContract();
        } else { // ----- Normal -----
            contractType = 'normal';
            normalShowContract();
        }
    };

    // ===== Contract: Spread =====
    var spreadShowContract = function() {
        setLoadingState(false);

        spreadSetValues();

        if (!$Container) {
            $Container = spreadMakeTemplate();
        }

        $Container.find('#entry_level').text(contract.entry_level);
        $Container.find('#per_point').text(contract.amount_per_point);

        spreadUpdate();
    };

    var spreadSetValues = function() {
        contract.is_ended = contract.is_settleable || contract.is_sold;
        contract.status = page.text.localize(contract.is_ended ? 'Closed' : 'Open');
    };

    var spreadUpdate = function() {
        spreadSetValues();

        containerSetText('status', contract.status, { class: contract.is_ended ? 'loss' : 'profit' });
        containerSetText('stop_loss_level', contract.stop_loss_level);
        containerSetText('stop_profit_level', contract.stop_profit_level);
        containerSetText('pl_value', parseFloat(contract.current_value_in_dollar).toFixed(2), { class: contract.current_value_in_dollar * 1 >= 0 ? 'profit' : 'loss' });
        containerSetText('pl_point', parseFloat(contract.current_value_in_point).toFixed(2));

        if (!contract.is_ended) {
            containerSetText('sell_level', contract.current_level);
        } else {
            spreadContractEnded(contract.current_value_in_dollar * 1 >= 0);
        }

        sellSetVisibility(!isSellClicked && !contract.is_ended);
    };

    // var spreadContractEnded = function(is_win) {
    var spreadContractEnded = function() {
        $Container.find('#sell_level').parent('tr').addClass(hiddenClass);
        $Container.find('#exit_level').text(contract.exit_level).parent('tr').removeClass(hiddenClass);
        sellSetVisibility(false);
        // showWinLossStatus(is_win);
    };

    var spreadMakeTemplate = function() {
        $Container = $('<div/>');
        $Container.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: page.text.localize('Contract Information') }));

        var $table = $('<table><tbody></tbody></table>');
        var tbody = spreadRow('Status', 'status', (contract.is_ended ? 'loss' : 'profit')) +
            spreadRow('Entry Level', 'entry_level') +
            spreadRow('Exit Level', 'exit_level', '', '', !contract.is_ended) +
            spreadRow('Stop Loss Level', 'stop_loss_level') +
            spreadRow('Stop Profit Level', 'stop_profit_level') +
            spreadRow('Current Level', 'sell_level', '', '', contract.is_ended) +
            spreadRow('Amount Per Point', 'per_point') +
            spreadRow('Profit/Loss', 'pl_value', (contract.profit >= 0 ? 'profit' : 'loss'), ' (' + contract.currency + ')') +
            spreadRow('Profit/Loss (points)', 'pl_point');

        $table.find('tbody').append(tbody);
        $Container.append(
            $('<div/>', { id: wrapperID })
            .append($('<div/>', { id: 'spread_table' }).append($table))
            .append($('<div/>', { id: 'errMsg', class: 'notice-msg ' + hiddenClass }))
            .append($('<div/>', { id: winStatusID, class: hiddenClass }))
            .append($('<div/>', { id: 'contract_sell_wrapper', class: hiddenClass })));

        ViewPopupUI.show_inpage_popup('<div class="' + popupboxID + '">' + $Container.html() + '</div>', 'spread_popup', '#sell_bet_desc, #sell_content_wrapper');

        return $('#' + wrapperID);
    };

    var spreadRow = function(label, id, classname, label_no_localize, isHidden) {
        return '<tr' + (isHidden ? ' class="' + hiddenClass + '"' : '') + '><td>' + page.text.localize(label) + (label_no_localize || '') + '</td><td' + (id ? ' id="' + id + '"' : '') + (classname ? ' class="' + classname + '"' : '') + '></td></tr>';
    };

    // ===== Contract: Normal =====
    var normalShowContract = function() {
        setLoadingState(false);

        if (!$Container) {
            $Container = normalMakeTemplate();
        }

        containerSetText('trade_details_contract_id', contract.contract_id);

        containerSetText('trade_details_start_date', toJapanTimeIfNeeded(epochToDateTime(contract.date_start)));
        if (document.getElementById('trade_details_end_date')) containerSetText('trade_details_end_date', toJapanTimeIfNeeded(epochToDateTime(contract.date_expiry)));
        containerSetText('trade_details_payout', format_money(contract.currency, contract.payout));
        containerSetText('trade_details_purchase_price', format_money(contract.currency, contract.buy_price));

        normalUpdateTimers();
        normalUpdate();
        ViewPopupUI.reposition_confirmation();
        if (State.get('is_mb_trading')) MBPrice.hidePriceOverlay();
    };

    var normalUpdate = function() {
        var finalPrice = contract.sell_price || contract.bid_price,
            is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start,
            user_sold = contract.sell_time && contract.sell_time <= contract.date_expiry,
            is_ended = contract.is_settleable || contract.is_sold || user_sold,
            indicative_price = finalPrice && is_ended ?
                             (contract.sell_price || contract.bid_price) : contract.bid_price ?
                             contract.bid_price : null;

        if (contract.barrier_count > 1) {
            containerSetText('trade_details_barrier', contract.high_barrier, '', true);
            containerSetText('trade_details_barrier_low', contract.low_barrier, '', true);
        } else if (contract.barrier) {
            containerSetText('trade_details_barrier', contract.entry_tick_time ?
                (contract.contract_type === 'DIGITMATCH' ? page.text.localize('Equals') + ' ' + contract.barrier :
                    contract.contract_type === 'DIGITDIFF' ? page.text.localize('Not') + ' ' + contract.barrier :
                    contract.barrier) : '-',
                '', true);
        }

        var currentSpot = !is_ended ? contract.current_spot : (user_sold ? contract.sell_spot : contract.exit_tick);
        var currentSpotTime = !is_ended ? contract.current_spot_time
                                        : (user_sold ? contract.sell_spot_time : contract.exit_tick_time);

        containerSetText('trade_details_ref_id', contract.transaction_ids.buy + (contract.transaction_ids.sell ? ' - ' + contract.transaction_ids.sell : ''));
        containerSetText('trade_details_current_date', toJapanTimeIfNeeded(epochToDateTime(currentSpotTime)));
        containerSetText('trade_details_current_spot', currentSpot || page.text.localize('not available'));
        containerSetText('trade_details_indicative_price', indicative_price ? format_money(contract.currency, indicative_price) : '-');

        var profit_loss;
        var percentage;
        // var jp_client;

        if (finalPrice) {
            profit_loss = finalPrice - contract.buy_price;
            percentage = ((profit_loss * 100) / contract.buy_price).toFixed(2);
            // jp_client = japanese_client();
            containerSetText('trade_details_profit_loss',
                format_money(contract.currency, profit_loss) + '<span>(' + (percentage > 0 ? '+' : '') + percentage + '%)</span>', { class: (profit_loss >= 0 ? 'profit' : 'loss') });
        } else {
            containerSetText('trade_details_profit_loss', '-', { class: 'loss' });
        }

        if (!is_started) {
            containerSetText('trade_details_entry_spot', '-');
            containerSetText('trade_details_message', page.text.localize('Contract is not started yet'));
        } else {
            if (contract.entry_spot > 0) {
                containerSetText('trade_details_entry_spot', contract.entry_spot);
            }
            containerSetText('trade_details_message', contract.validation_error ? contract.validation_error : corporateActionEvent ? '* ' + page.text.localize('This contract was affected by a Corporate Action event.') : '&nbsp;');
        }

        if (!chartStarted && !contract.tick_count) {
            if (!tickForgotten) {
                tickForgotten = true;
                socketSend({ forget_all: 'ticks' });
            }
            if (!candleForgotten) {
                candleForgotten = true;
                socketSend({ forget_all: 'candles' });
                Highchart.show_chart(contract);
            }
            if (candleForgotten && tickForgotten) {
                Highchart.show_chart(contract, 'update');
                if (contract.entry_tick_time) {
                    chartStarted = true;
                }
            }
        } else if (contract.tick_count && !chartUpdated) {
            WSTickDisplay.updateChart('', contract);
            chartUpdated = true;
        }

        if (!isSold && user_sold) {
            isSold = true;
            if (!contract.tick_count) Highchart.show_chart(contract, 'update');
        }
        if (is_ended) {
            normalContractEnded(parseFloat(profit_loss) >= 0);
            if (contract.is_valid_to_sell && contract.is_settleable && !contract.is_sold && !isSellClicked) {
                ViewPopupUI.forget_streams();
                sellExpired();
            }
            if (!contract.tick_count) Highchart.show_chart(contract, 'update');
        }

        if (!contract.is_valid_to_sell) {
            $Container.find('#errMsg').addClass(hiddenClass);
        }

        sellSetVisibility(!isSellClicked && !isSold && !is_ended && +contract.is_valid_to_sell === 1);
        contract.chart_validation_error = contract.validation_error;
        contract.validation_error = '';
    };

    var normalUpdateTimers = function() {
        var update_time = function() {
            var now = Math.max(Math.ceil((window.time || 0) / 1000), contract.current_spot_time || 0);
            containerSetText('trade_details_live_date', toJapanTimeIfNeeded(epochToDateTime(now)));
            showLocalTimeOnHover('#trade_details_live_date');

            var is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start,
                is_ended = contract.is_settleable || contract.is_sold;
            if ((!is_started || is_ended || now >= contract.date_expiry) && document.getElementById('trade_details_live_remaining')) {
                containerSetText('trade_details_live_remaining', '-');
            } else {
                var remained = contract.date_expiry - now,
                    day_seconds = 24 * 60 * 60,
                    days = 0;
                if (remained > day_seconds) {
                    days = Math.floor(remained / day_seconds);
                    remained %= day_seconds;
                }
                if (document.getElementById('trade_details_live_remaining')) {
                    containerSetText('trade_details_live_remaining',
                        (days > 0 ? days + ' ' + page.text.localize(days > 1 ? 'days' : 'day') + ', ' : '') +
                        moment((remained) * 1000).utc().format('HH:mm:ss'));
                }
            }
        };
        update_time();

        clearInterval(window.ViewPopupTimerInterval);
        window.ViewPopupTimerInterval = setInterval(update_time, 500);
    };

    // var normalContractEnded = function(is_win) {
    var normalContractEnded = function() {
        containerSetText('trade_details_current_title', page.text.localize(contract.sell_spot_time < contract.date_expiry ? 'Contract Sold' : 'Contract Expiry'));
        containerSetText('trade_details_spot_label', page.text.localize('Exit Spot'));
        containerSetText('trade_details_spottime_label', page.text.localize('Exit Spot Time'));
        containerSetText('trade_details_indicative_label', page.text.localize('Price'));
        // show validation error if contract is not settled yet
        if (!(contract.is_settleable && !contract.is_sold)) {
            containerSetText('trade_details_message', '&nbsp;');
        }
        $Container.find('#errMsg').addClass(hiddenClass);
        sellSetVisibility(false);
        // showWinLossStatus(is_win);
    };

    var addColorAndClass = function($tabToShow, $tabToHide, $contentToShow, $contentToHide) {
        $tabToShow.attr('style', 'background: #f2f2f2;');
        $tabToHide.attr('style', 'background: #c2c2c2;');
        $contentToHide.addClass('invisible');
        $contentToShow.removeClass('invisible');
    };

    var showCorporateAction = function() {
        var $contractInformationTab = $('#contract_information_tab'),
            $contractInformationContent = $('#contract_information_content');

        $contractInformationTab.removeAttr('colspan');
        $('#contract_tabs').append('<th id="corporate_action_tab">' + page.text.localize('Corporate Action') + '</th>');

        var $corporateActionTab = $('#corporate_action_tab'),
            $corporateActionContent = $('#corporate_action_content');
        var $barrierChange = $('#barrier_change'),
            $barrierChangeContent = $('#barrier_change_content');

        $corporateActionTab.attr('style', 'background: #c2c2c2;');
        $('#sell_details_table').draggable({ disabled: true });

        $corporateActionTab.on('click', function() {
            addColorAndClass($corporateActionTab, $contractInformationTab,
                             $corporateActionContent, $contractInformationContent);
            $barrierChange.removeClass('invisible');
            $barrierChangeContent.removeClass('invisible');
        });
        $contractInformationTab.on('click', function() {
            $barrierChange.addClass('invisible');
            $barrierChangeContent.addClass('invisible');
            addColorAndClass($contractInformationTab, $corporateActionTab,
                             $contractInformationContent, $corporateActionContent);
        });
    };

    var populateCorporateAction = function(corporateAction) {
        for (var i = 0; i < corporateAction.get_corporate_actions.actions.length; i++) {
            $('#corporate_action_content').append(
                normalRow(corporateAction.get_corporate_actions.actions[i].display_date, '', '', '', corporateAction.get_corporate_actions.actions[i].type + ' (' + corporateAction.get_corporate_actions.actions[i].value + '-' + page.text.localize('for') + '-1)'));
        }
        var originalBarriers,
            adjustedBarriers;

        if (contract.original_barrier) {
            originalBarriers = normalRow(page.text.localize('Original Barrier'), '', '', '', contract.original_barrier);
        } else if (contract.original_high_barrier) {
            originalBarriers = normalRow(page.text.localize('Original High Barrier'), '', '', '', contract.original_high_barrier) +
                normalRow(page.text.localize('Original Low Barrier'), '', '', '', contract.original_low_barrier);
        }
        if (contract.barrier) {
            adjustedBarriers = normalRow(page.text.localize('Adjusted Barrier'), '', '', '', contract.barrier);
        } else if (contract.high_barrier) {
            adjustedBarriers = normalRow(page.text.localize('Adjusted High Barrier'), '', '', '', contract.high_barrier) +
                normalRow(page.text.localize('Adjusted Low Barrier'), '', '', '', contract.low_barrier);
        }
        $('#barrier_change_content').append(
            originalBarriers +
            adjustedBarriers);
    };

    var normalMakeTemplate = function() {
        $Container = $('<div/>').append($('<div/>', { id: wrapperID }));

        var longcode = contract.longcode;

        $Container.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: longcode }));
        var $sections = $('<div/>').append($('<div class="gr-row container"><div id="sell_details_chart_wrapper" class="gr-8 gr-12-m"></div><div id="sell_details_table" class="gr-4 gr-12-m"></div></div>'));

        $sections.find('#sell_details_table').append($(
            '<table>' +
            '<tr id="contract_tabs"><th colspan="2" id="contract_information_tab">' + page.text.localize('Contract Information') + '</th></tr><tbody id="contract_information_content">' +
            normalRow('Contract ID', '', 'trade_details_contract_id') +
            normalRow('Reference ID', '', 'trade_details_ref_id') +
            normalRow('Start Time', '', 'trade_details_start_date') +
            (!contract.tick_count ? normalRow('End Time', '', 'trade_details_end_date') +
                normalRow('Remaining Time', '', 'trade_details_live_remaining') : '') +
            normalRow('Entry Spot', '', 'trade_details_entry_spot') +
            normalRow(contract.barrier_count > 1 ? 'High Barrier' :
                /^DIGIT(MATCH|DIFF)$/.test(contract.contract_type) ? 'Target' : 'Barrier', '', 'trade_details_barrier', true) +
            (contract.barrier_count > 1 ? normalRow('Low Barrier', '', 'trade_details_barrier_low', true) : '') +
            normalRow('Potential Payout', '', 'trade_details_payout') +
            normalRow('Purchase Price', '', 'trade_details_purchase_price') +
            '</tbody><tbody id="corporate_action_content" class="invisible"></tbody>' +
            '<th colspan="2" id="barrier_change" class="invisible">' + page.text.localize('Barrier Change') + '</th>' +
            '<tbody id="barrier_change_content" class="invisible"></tbody>' +
            '<tr><th colspan="2" id="trade_details_current_title">' + page.text.localize('Current') + '</th></tr>' +
            normalRow('Spot', 'trade_details_spot_label', 'trade_details_current_spot') +
            normalRow('Spot Time', 'trade_details_spottime_label', 'trade_details_current_date') +
            normalRow('Current Time', '', 'trade_details_live_date') +
            normalRow('Indicative', 'trade_details_indicative_label', 'trade_details_indicative_price') +
            normalRow('Profit/Loss', '', 'trade_details_profit_loss') +
            '<tr><td colspan="2" class="last_cell" id="trade_details_message">&nbsp;</td></tr>' +
            '</table>' +
            '<div id="errMsg" class="notice-msg hidden"></div>' +
            '<div id="trade_details_bottom"><div id="contract_sell_wrapper" class="' + hiddenClass + '"></div><div id="contract_sell_message"></div><div id="contract_win_status" class="' + hiddenClass + '"></div></div>'));

        $sections.find('#sell_details_chart_wrapper').html('<div id="live_chart_form_wrapper" class="gr-12"></div>' +
            '<div class="chart-notice"><div class="notice" id="delayed_feed_notice" style="display: none;">Charting for this underlying is delayed</div><div class="notice" id="not_available_notice" style="display: none;">Charting is not available for this underlying</div></div>' +
            '<div id="' + (contract.tick_count ? 'tick_chart' : 'analysis_live_chart') + '" class="live_chart_wrapper gr-12"></div>');

        $Container.find('#' + wrapperID)
            .append($sections.html())
            .append($('<div/>', { id: 'errMsg', class: 'notice-msg ' + hiddenClass }));

        ViewPopupUI.show_inpage_popup('<div class="' + popupboxID + '">' + $Container.html() + '</div>', '', '#sell_bet_desc');
        return $('#' + wrapperID);
    };

    var normalRow = function(label, label_id, value_id, isHidden, value) {
        return '<tr' + (isHidden ? ' class="' + hiddenClass + '"' : '') + '><td' + (label_id ? ' id="' + label_id + '"' : '') + '>' + page.text.localize(label) + '</td><td' + (value_id ? ' id="' + value_id + '"' : '') + '>' + (value || '') + '</td></tr>';
    };

    var epochToDateTime = function(epoch) {
        return moment.utc(epoch * 1000).format('YYYY-MM-DD HH:mm:ss');
    };

    // ===== Tools =====
    var containerSetText = function(id, text, attributes, isVisible) {
        if (!$Container || $Container.length === 0) {
            $Container = $('#' + wrapperID);
        }

        var $target = $Container.find('#' + id);
        if ($target && $target.length > 0) {
            $target.html(text);
            if (attributes) $target.attr(attributes);
            if (isVisible) $target.parent('tr').removeClass(hiddenClass);
        }
    };

    /* var showWinLossStatus = function(isWin) {
        containerSetText(
            winStatusID,
            page.text.localize('This contract has ' + (isWin ? 'WON' : 'LOST')),
            {class: isWin ? 'won' : 'lost'}
        );
    };*/

    var setLoadingState = function(showLoading) {
        if (showLoading) {
            $loading = $('#trading_init_progress');
            if ($loading.length) {
                $loading.show();
            }
        } else {
            if ($loading.length) {
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
        $con.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: page.text.localize(title) }));
        $con.append(
            $('<div/>', { id: wrapperID })
            .append($('<div/>', { class: msgClass, html: page.text.localize(message) })));
        ViewPopupUI.show_inpage_popup('<div class="' + popupboxID + '">' + $con.html() + '</div>', 'message_popup', '#sell_bet_desc');
    };

    var showErrorPopup = function(response, message) {
        message = message || 'Sorry, an error occurred while processing your request.';
        showMessagePopup(page.text.localize(message), 'There was an error', 'notice-msg');
        console.log(response);
    };

    var sellSetVisibility = function(show) {
        var sellWrapperID = 'sell_at_market_wrapper',
            sellButtonID = 'sell_at_market';
        var isExist = $Container.find('#' + sellWrapperID).length > 0;
        if (show) {
            if (isExist) return;
            if (contractType === 'spread') {
                $Container.find('#contract_sell_wrapper').removeClass(hiddenClass).append(
                    $('<p/>', { id: sellWrapperID, class: 'button' })
                    .append($('<button/>', { id: sellButtonID, class: 'button', text: page.text.localize('Sell') })));
            } else {
                $Container.find('#contract_sell_wrapper').removeClass(hiddenClass).append($('<div id="' + sellWrapperID + '"><span class="button"><button id="' + sellButtonID + '" class="button">' + page.text.localize('Sell at market') + '</button></span>' +
                    '<div class="note"><strong>' + page.text.localize('Note') + ':</strong> ' + page.text.localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.') + '</div>'));
            }
            $Container.find('#' + sellButtonID).unbind('click').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                isSellClicked = true;
                sellSetVisibility(false);
                sellContract();
            });
        } else {
            if (!isExist) return;
            $Container.find('#' + sellButtonID).unbind('click');
            $Container.find('#' + sellWrapperID).remove();
        }
    };

    // ===== Requests & Responses =====
    // ----- Get Contract -----
    var getContract = function(option) {
        if (contractID) {
            ViewPopupUI.forget_streams();
            var req = {
                proposal_open_contract: 1,
                contract_id           : contractID,
                subscribe             : 1,
            };
            if (option === 'no-subscribe') delete req.subscribe;
            socketSend(req);
        }
    };

    // ----- Corporate Action -----
    var getCorporateActions = function() {
        var epoch = window.time.unix();
        var end_time = epoch < contract.date_expiry ? epoch.toFixed(0) : contract.date_expiry;
        socketSend({
            get_corporate_actions: '1',
            symbol               : contract.underlying,
            start                : contract.date_start,
            end                  : end_time,
        });
    };

    // ----- Sell Expired -----
    var sellExpired = function() {
        socketSend({ sell_expired: 1, passthrough: {} });
    };

    var responseSellExpired = function() {
        getContract();
    };

    // ----- Sell Contract -----
    var sellContract = function() {
        socketSend({ sell: contractID, price: contract.bid_price, passthrough: {} });
    };

    var responseSell = function(response) {
        if (response.hasOwnProperty('error')) {
            if (response.error.code === 'NoOpenPosition') {
                getContract();
            } else {
                $Container.find('#errMsg').text(response.error.message).removeClass(hiddenClass);
            }
            sellSetVisibility(true);
            isSellClicked = false;
            return;
        }
        ViewPopupUI.forget_streams();
        $Container.find('#errMsg').addClass(hiddenClass);
        sellSetVisibility(false);
        if (contractType === 'spread') {
            getContract();
        } else if (contractType === 'normal') {
            if (isSellClicked) {
                containerSetText('contract_sell_message',
                    page.text.localize('You have sold this contract at [_1] [_2]', [contract.currency, response.sell.sold_for]) +
                    '<br />' +
                    page.text.localize('Your transaction reference number is [_1]', [response.sell.transaction_id]));
            }
            getContract('no-subscribe');
        }
    };

    var socketSend = function(req) {
        if (!req.hasOwnProperty('passthrough')) {
            req.passthrough = {};
        }
        req.passthrough.dispatch_to = 'ViewPopupWS';
        BinarySocket.send(req);
    };

    var dispatch = function(response) {
        switch (response.msg_type) {
            case 'proposal_open_contract':
                if (response.proposal_open_contract) {
                    if (response.proposal_open_contract.contract_id === contractID) {
                        ViewPopupUI.storeSubscriptionID(response.proposal_open_contract.id);
                        responseContract(response);
                    } else {
                        BinarySocket.send({ forget: response.proposal_open_contract.id });
                    }
                } else if (response.echo_req.contract_id === contractID && response.error && response.error.code !== 'AlreadySubscribed') {
                    showErrorPopup(response, response.error.message);
                }
                break;
            case 'sell':
                responseSell(response);
                break;
            case 'sell_expired':
                responseSellExpired();
                break;
            case 'get_corporate_actions':
                if (objectNotEmpty(response.get_corporate_actions)) {
                    corporateActionEvent = true;
                    containerSetText('trade_details_message', contract.validation_error ? contract.validation_error : corporateActionEvent ? '* ' + page.text.localize('This contract was affected by a Corporate Action event.') : '&nbsp;');
                    populateCorporateAction(response);
                    showCorporateAction();
                }
                break;
            default:
                break;
        }
        var i,
            dates = ['#trade_details_start_date', '#trade_details_end_date', '#trade_details_current_date', '#trade_details_live_date'];
        for (i = 0; i < dates.length; i++) {
            showLocalTimeOnHover(dates[i]);
            $(dates[i]).attr('data-balloon-pos', 'left');
        }
    };

    return {
        init        : init,
        dispatch    : dispatch,
        spreadUpdate: spreadUpdate,
        normalUpdate: normalUpdate,
    };
})();

module.exports = {
    ViewPopupWS: ViewPopupWS,
};
