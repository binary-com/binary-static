const moment               = require('moment');
const ViewPopupUI          = require('./view_popup.ui');
const MBPrice              = require('../../mb_trade/mb_price');
const Highchart            = require('../../trade/charts/highchart');
const TickDisplay          = require('../../trade/tick_trade');
const showLocalTimeOnHover = require('../../../base/clock').showLocalTimeOnHover;
const toJapanTimeIfNeeded  = require('../../../base/clock').toJapanTimeIfNeeded;
const localize             = require('../../../base/localize').localize;
const State                = require('../../../base/storage').State;
const isEmptyObject        = require('../../../base/utility').isEmptyObject;
const formatMoney          = require('../../../common_functions/currency_to_symbol').formatMoney;

const ViewPopup = (() => {
    'use strict';

    let contract_id,
        contract_type,
        contract,
        is_sold,
        is_sell_clicked,
        chart_started,
        tick_forgotten,
        candle_forgotten,
        corporate_action_event,
        corporate_action_sent,
        chart_updated;
    let $container,
        $loading,
        btn_view;

    const popupbox_id   = 'inpage_popup_content_box';
    const wrapper_id    = 'sell_content_wrapper';
    const win_status_id = 'contract_win_status';
    const hidden_class  = 'hidden';

    const init = (button) => {
        btn_view               = button;
        contract_id            = $(btn_view).attr('contract_id');
        contract_type          = '';
        contract               = {};
        is_sold                = false;
        is_sell_clicked        = false;
        chart_started          = false;
        tick_forgotten         = false;
        candle_forgotten       = false;
        chart_updated          = false;
        corporate_action_event = false;
        corporate_action_sent  = false;
        $container             = '';

        if (btn_view) {
            ViewPopupUI.disableButton($(btn_view));
            ViewPopupUI.cleanup();
        }

        getContract();

        setLoadingState(true);
    };

    const responseContract = (response) => {
        if (!response.proposal_open_contract || isEmptyObject(response.proposal_open_contract)) {
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

        if (contract && contract_type) {
            if (!document.getElementById(wrapper_id)) return;
            ViewPopup[`${contract_type}Update`]();
            return;
        }

        // ----- Corporate Action -----
        if (contract.has_corporate_actions && !corporate_action_sent) {
            corporate_action_sent = true;
            getCorporateActions();
        }

        // ----- Spread -----
        if (contract.shortcode.toUpperCase().indexOf('SPREAD') === 0) {
            contract_type = 'spread';
            spreadShowContract();
        } else { // ----- Normal -----
            contract_type = 'normal';
            normalShowContract();
        }
    };

    // ===== Contract: Spread =====
    const spreadShowContract = () => {
        setLoadingState(false);

        spreadSetValues();

        if (!$container) {
            $container = spreadMakeTemplate();
        }

        $container.find('#entry_level').text(contract.entry_level);
        $container.find('#per_point').text(contract.amount_per_point);

        spreadUpdate();
    };

    const spreadSetValues = () => {
        contract.is_ended = contract.is_settleable || contract.is_sold;
        contract.status = localize(contract.is_ended ? 'Closed' : 'Open');
    };

    const spreadUpdate = () => {
        spreadSetValues();

        containerSetText('status',            contract.status, { class: contract.is_ended ? 'loss' : 'profit' });
        containerSetText('stop_loss_level',   contract.stop_loss_level);
        containerSetText('stop_profit_level', contract.stop_profit_level);
        containerSetText('pl_value',          parseFloat(contract.current_value_in_dollar).toFixed(2), { class: +contract.current_value_in_dollar >= 0 ? 'profit' : 'loss' });
        containerSetText('pl_point',          parseFloat(contract.current_value_in_point).toFixed(2));

        if (!contract.is_ended) {
            containerSetText('sell_level', contract.current_level);
        } else {
            spreadContractEnded(+contract.current_value_in_dollar >= 0);
        }

        sellSetVisibility(!is_sell_clicked && !contract.is_ended);
    };

    const spreadContractEnded = () => {
        $container.find('#sell_level').parent('tr').addClass(hidden_class);
        $container.find('#exit_level').text(contract.exit_level).parent('tr').removeClass(hidden_class);
        sellSetVisibility(false);
    };

    const spreadMakeTemplate = () => {
        $container = $('<div/>');
        $container.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: localize('Contract Information') }));

        const $table = $('<table><tbody></tbody></table>');
        const tbody = spreadRow('Status',    'status', (contract.is_ended ? 'loss' : 'profit')) +
            spreadRow('Entry Level',       'entry_level') +
            spreadRow('Exit Level',        'exit_level', '', '', !contract.is_ended) +
            spreadRow('Stop Loss Level',   'stop_loss_level') +
            spreadRow('Stop Profit Level', 'stop_profit_level') +
            spreadRow('Current Level',     'sell_level', '', '', contract.is_ended) +
            spreadRow('Amount Per Point',  'per_point') +
            spreadRow('Profit/Loss',       'pl_value', (contract.profit >= 0 ? 'profit' : 'loss'), ` (${contract.currency})`) +
            spreadRow('Profit/Loss (points)', 'pl_point');

        $table.find('tbody').append(tbody);
        $container.append(
            $('<div/>', { id: wrapper_id })
            .append($('<div/>', { id: 'spread_table' }).append($table))
            .append($('<div/>', { id: 'errMsg', class: `notice-msg ${hidden_class}` }))
            .append($('<div/>', { id: win_status_id, class: hidden_class }))
            .append($('<div/>', { id: 'contract_sell_wrapper', class: hidden_class })));

        ViewPopupUI.showInpagePopup(`<div class="${popupbox_id}">${$container.html()}</div>`, 'spread_popup', '#sell_bet_desc, #sell_content_wrapper');

        return $(`#${wrapper_id}`);
    };

    const spreadRow = (label, id, classname, label_no_localize, is_hidden) => (
        `<tr${(is_hidden ? ` class="${hidden_class}"` : '')}><td>${localize(label)}${(label_no_localize || '')}</td><td${(id ? ` id="${id}"` : '')}${(classname ? ` class="${classname}"` : '')}></td></tr>`
    );

    // ===== Contract: Normal =====
    const normalShowContract = () => {
        setLoadingState(false);

        if (!$container) {
            $container = normalMakeTemplate();
        }

        containerSetText('trade_details_contract_id',    contract.contract_id);

        containerSetText('trade_details_start_date',     toJapanTimeIfNeeded(epochToDateTime(contract.date_start)));
        if (document.getElementById('trade_details_end_date')) containerSetText('trade_details_end_date', toJapanTimeIfNeeded(epochToDateTime(contract.date_expiry)));
        containerSetText('trade_details_payout',         formatMoney(contract.currency, contract.payout));
        containerSetText('trade_details_purchase_price', formatMoney(contract.currency, contract.buy_price));

        normalUpdateTimers();
        normalUpdate();
        ViewPopupUI.repositionConfirmation();
        if (State.get('is_mb_trading')) MBPrice.hidePriceOverlay();
    };

    const normalUpdate = () => {
        const final_price      = contract.sell_price || contract.bid_price;
        const is_started       = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
        const user_sold        = contract.sell_time && contract.sell_time < contract.date_expiry;
        const is_ended         = contract.is_settleable || contract.is_sold || user_sold;
        const indicative_price = final_price && is_ended ?
                             (contract.sell_price || contract.bid_price) : contract.bid_price ?
                             contract.bid_price : null;

        if (contract.barrier_count > 1) {
            containerSetText('trade_details_barrier',     contract.high_barrier, '', true);
            containerSetText('trade_details_barrier_low', contract.low_barrier, '', true);
        } else if (contract.barrier) {
            containerSetText('trade_details_barrier',     contract.entry_tick_time ?
                (contract.contract_type === 'DIGITMATCH' ? `${localize('Equals')} ${contract.barrier}` :
                    contract.contract_type === 'DIGITDIFF' ? `${localize('Not')} ${contract.barrier}` :
                    contract.barrier) : '-',
                '', true);
        }

        const current_spot = !is_ended ? contract.current_spot : (user_sold ? '' : contract.exit_tick);
        const current_spot_time = !is_ended ? contract.current_spot_time : (user_sold ? '' : contract.exit_tick_time);

        if (current_spot) {
            containerSetText('trade_details_current_spot', current_spot);
        } else {
            $('#trade_details_current_spot').parent().addClass(hidden_class);
        }

        if (current_spot_time) {
            containerSetText('trade_details_current_date', toJapanTimeIfNeeded(epochToDateTime(current_spot_time)));
        } else {
            $('#trade_details_current_date').parent().addClass(hidden_class);
        }

        containerSetText('trade_details_ref_id',           contract.transaction_ids.buy + (contract.transaction_ids.sell ? ` - ${contract.transaction_ids.sell}` : ''));
        containerSetText('trade_details_indicative_price', indicative_price ? formatMoney(contract.currency, indicative_price) : '-');

        let profit_loss,
            percentage;

        if (final_price) {
            profit_loss = final_price - contract.buy_price;
            percentage = ((profit_loss * 100) / contract.buy_price).toFixed(2);
            containerSetText('trade_details_profit_loss',
                `${formatMoney(contract.currency, profit_loss)}<span>(${(percentage > 0 ? '+' : '')}${percentage}%)</span>`, { class: (profit_loss >= 0 ? 'profit' : 'loss') });
        } else {
            containerSetText('trade_details_profit_loss', '-', { class: 'loss' });
        }

        if (!is_started) {
            containerSetText('trade_details_entry_spot', '-');
            containerSetText('trade_details_message', localize('Contract is not started yet'));
        } else {
            if (contract.entry_spot > 0) {
                containerSetText('trade_details_entry_spot', contract.entry_spot);
            }
            containerSetText('trade_details_message', contract.validation_error ? contract.validation_error : corporate_action_event ? `* ${localize('This contract was affected by a Corporate Action event.')}` : '&nbsp;');
        }

        if (!chart_started && !contract.tick_count) {
            if (!tick_forgotten) {
                tick_forgotten = true;
                BinarySocket.send({ forget_all: 'ticks' });
            }
            if (!candle_forgotten) {
                candle_forgotten = true;
                BinarySocket.send({ forget_all: 'candles' });
                Highchart.showChart(contract);
            }
            if (candle_forgotten && tick_forgotten) {
                Highchart.showChart(contract, 'update');
                if (contract.entry_tick_time) {
                    chart_started = true;
                }
            }
        } else if (contract.tick_count && !chart_updated) {
            TickDisplay.updateChart('', contract);
            chart_updated = true;
        }

        if (!is_sold && user_sold) {
            is_sold = true;
            if (!contract.tick_count) Highchart.showChart(contract, 'update');
        }
        if (is_ended) {
            normalContractEnded(parseFloat(profit_loss) >= 0);
            if (contract.is_valid_to_sell && contract.is_settleable && !contract.is_sold && !is_sell_clicked) {
                ViewPopupUI.forgetStreams();
                BinarySocket.send({ sell_expired: 1 }).then((response) => {
                    getContract(response);
                });
            }
            if (!contract.tick_count) Highchart.showChart(contract, 'update');
        }

        if (!contract.is_valid_to_sell) {
            $container.find('#errMsg').addClass(hidden_class);
        }

        sellSetVisibility(!is_sell_clicked && !is_sold && !is_ended && +contract.is_valid_to_sell === 1);
        contract.chart_validation_error = contract.validation_error;
        contract.validation_error = '';
    };

    const normalUpdateTimers = () => {
        const update_time = () => {
            const now = Math.max(Math.ceil((window.time || 0) / 1000), contract.current_spot_time || 0);
            containerSetText('trade_details_live_date', toJapanTimeIfNeeded(epochToDateTime(now)));
            showLocalTimeOnHover('#trade_details_live_date');

            const is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
            const is_ended   = contract.is_settleable || contract.is_sold;
            if ((!is_started || is_ended || now >= contract.date_expiry) && document.getElementById('trade_details_live_remaining')) {
                containerSetText('trade_details_live_remaining', '-');
            } else {
                let remained = contract.date_expiry - now,
                    days = 0;
                const day_seconds = 24 * 60 * 60;
                if (remained > day_seconds) {
                    days = Math.floor(remained / day_seconds);
                    remained %= day_seconds;
                }
                if (document.getElementById('trade_details_live_remaining')) {
                    containerSetText('trade_details_live_remaining',
                        (days > 0 ? `${days} ${localize(days > 1 ? 'days' : 'day')}, ` : '') +
                        moment((remained) * 1000).utc().format('HH:mm:ss'));
                }
            }
        };
        update_time();

        clearInterval(window.ViewPopupTimerInterval);
        window.ViewPopupTimerInterval = setInterval(update_time, 500);
    };

    const normalContractEnded = () => {
        containerSetText('trade_details_current_title',    localize(contract.sell_spot_time < contract.date_expiry ? 'Contract Sold' : 'Contract Expiry'));
        containerSetText('trade_details_spot_label',       localize('Exit Spot'));
        containerSetText('trade_details_spottime_label',   localize('Exit Spot Time'));
        containerSetText('trade_details_indicative_label', localize('Price'));
        // show validation error if contract is not settled yet
        if (!(contract.is_settleable && !contract.is_sold)) {
            containerSetText('trade_details_message', '&nbsp;');
        }
        $container.find('#errMsg').addClass(hidden_class);
        sellSetVisibility(false);
        // showWinLossStatus(is_win);
    };

    const addColorAndClass = ($tab_to_show, $tab_to_hide, $content_to_show, $content_to_hide) => {
        $tab_to_show.attr('style', 'background: #f2f2f2;');
        $tab_to_hide.attr('style', 'background: #c2c2c2;');
        $content_to_hide.addClass('invisible');
        $content_to_show.removeClass('invisible');
    };

    const showCorporateAction = () => {
        const $contract_information_tab = $('#contract_information_tab');
        const $contract_information_content = $('#contract_information_content');

        $contract_information_tab.removeAttr('colspan');
        $('#contract_tabs').append(`<th id="corporate_action_tab">${localize('Corporate Action')}</th>`);

        const $corporate_action_tab     = $('#corporate_action_tab');
        const $corporate_action_content = $('#corporate_action_content');
        const $barrier_change         = $('#barrier_change');
        const $barrier_change_content = $('#barrier_change_content');

        $corporate_action_tab.attr('style', 'background: #c2c2c2;');
        $('#sell_details_table').draggable({ disabled: true });

        $corporate_action_tab.on('click', () => {
            addColorAndClass($corporate_action_tab, $contract_information_tab,
                             $corporate_action_content, $contract_information_content);
            $barrier_change.removeClass('invisible');
            $barrier_change_content.removeClass('invisible');
        });
        $contract_information_tab.on('click', () => {
            $barrier_change.addClass('invisible');
            $barrier_change_content.addClass('invisible');
            addColorAndClass($contract_information_tab, $corporate_action_tab,
                             $contract_information_content, $corporate_action_content);
        });
    };

    const populateCorporateAction = (corporate_action) => {
        for (let i = 0; i < corporate_action.get_corporate_actions.actions.length; i++) {
            $('#corporate_action_content').append(
                normalRow(corporate_action.get_corporate_actions.actions[i].display_date, '', '', '', `${corporate_action.get_corporate_actions.actions[i].type} (${corporate_action.get_corporate_actions.actions[i].value}-${localize('for')}-1)`));
        }
        let original_barriers,
            adjusted_barriers;

        if (contract.original_barrier) {
            original_barriers = normalRow(localize('Original Barrier'), '', '', '', contract.original_barrier);
        } else if (contract.original_high_barrier) {
            original_barriers = normalRow(localize('Original High Barrier'), '', '', '', contract.original_high_barrier) +
                normalRow(localize('Original Low Barrier'), '', '', '', contract.original_low_barrier);
        }
        if (contract.barrier) {
            adjusted_barriers = normalRow(localize('Adjusted Barrier'), '', '', '', contract.barrier);
        } else if (contract.high_barrier) {
            adjusted_barriers = normalRow(localize('Adjusted High Barrier'), '', '', '', contract.high_barrier) +
                normalRow(localize('Adjusted Low Barrier'), '', '', '', contract.low_barrier);
        }
        $('#barrier_change_content').append(
            original_barriers +
            adjusted_barriers);
    };

    const normalMakeTemplate = () => {
        $container = $('<div/>').append($('<div/>', { id: wrapper_id }));

        const longcode = contract.longcode;

        $container.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: longcode }));
        const $sections = $('<div/>').append($('<div class="gr-row container"><div id="sell_details_chart_wrapper" class="gr-8 gr-12-m"></div><div id="sell_details_table" class="gr-4 gr-12-m"></div></div>'));

        $sections.find('#sell_details_table').append($(
            `<table>
            <tr id="contract_tabs"><th colspan="2" id="contract_information_tab">${localize('Contract Information')}</th></tr><tbody id="contract_information_content">
            ${normalRow('Contract ID', '', 'trade_details_contract_id')}
            ${normalRow('Reference ID', '', 'trade_details_ref_id')}
            ${normalRow('Start Time', '', 'trade_details_start_date')}
            ${(!contract.tick_count ? normalRow('End Time', '', 'trade_details_end_date') +
                normalRow('Remaining Time', '', 'trade_details_live_remaining') : '')}
            ${normalRow('Entry Spot', '', 'trade_details_entry_spot')}
            ${normalRow(contract.barrier_count > 1 ? 'High Barrier' :
                /^DIGIT(MATCH|DIFF)$/.test(contract.contract_type) ? 'Target' : 'Barrier', '', 'trade_details_barrier', true)}
            ${(contract.barrier_count > 1 ? normalRow('Low Barrier', '', 'trade_details_barrier_low', true) : '')}
            ${normalRow('Potential Payout', '', 'trade_details_payout')}
            ${normalRow('Purchase Price', '', 'trade_details_purchase_price')}
            </tbody><tbody id="corporate_action_content" class="invisible"></tbody>
            <th colspan="2" id="barrier_change" class="invisible">${localize('Barrier Change')}</th>
            <tbody id="barrier_change_content" class="invisible"></tbody>
            <tr><th colspan="2" id="trade_details_current_title">${localize('Current')}</th></tr>
            ${normalRow('Spot', 'trade_details_spot_label', 'trade_details_current_spot')}
            ${normalRow('Spot Time', 'trade_details_spottime_label', 'trade_details_current_date')}
            ${normalRow('Current Time', '', 'trade_details_live_date')}
            ${normalRow('Indicative', 'trade_details_indicative_label', 'trade_details_indicative_price')}
            ${normalRow('Profit/Loss', '', 'trade_details_profit_loss')}
            <tr><td colspan="2" class="last_cell" id="trade_details_message">&nbsp;</td></tr>
            </table>
            <div id="errMsg" class="notice-msg hidden"></div>
            <div id="trade_details_bottom"><div id="contract_sell_wrapper" class="${hidden_class}"></div><div id="contract_sell_message"></div><div id="contract_win_status" class="${hidden_class}"></div></div>`));

        $sections.find('#sell_details_chart_wrapper').html($('<div/>', { id: (contract.tick_count ? 'tick_chart' : 'analysis_live_chart'), class: 'live_chart_wrapper' }));

        $container.find(`#${wrapper_id}`)
            .append($sections.html())
            .append($('<div/>', { id: 'errMsg', class: `notice-msg ${hidden_class}` }));

        ViewPopupUI.showInpagePopup(`<div class="${popupbox_id}">${$container.html()}</div>`, '', '#sell_bet_desc');
        return $(`#${wrapper_id}`);
    };

    const normalRow = (label, label_id, value_id, is_hidden, value) => (
        `<tr${(is_hidden ? ` class="${hidden_class}"` : '')}><td${(label_id ? ` id="${label_id}"` : '')}>${localize(label)}</td><td${(value_id ? ` id="${value_id}"` : '')}>${(value || '')}</td></tr>`
    );

    const epochToDateTime = epoch => moment.utc(epoch * 1000).format('YYYY-MM-DD HH:mm:ss');

    // ===== Tools =====
    const containerSetText = (id, string, attributes, is_visible) => {
        if (!$container || $container.length === 0) {
            $container = $(`#${wrapper_id}`);
        }

        const $target = $container.find(`#${id}`);
        if ($target && $target.length > 0) {
            $target.html(string);
            if (attributes) $target.attr(attributes);
            if (is_visible) $target.parent('tr').removeClass(hidden_class);
        }
    };

    const setLoadingState = (show_loading) => {
        if (show_loading) {
            $loading = $('#trading_init_progress');
            if ($loading.length) {
                $loading.show();
            }
        } else {
            if ($loading.length) {
                $loading.hide();
            }
            if (btn_view) {
                ViewPopupUI.enableButton($(btn_view));
            }
        }
    };

    const showMessagePopup = (message, title, msg_class) => {
        setLoadingState(false);
        const $con = $('<div/>');
        $con.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: localize(title) }));
        $con.append(
            $('<div/>', { id: wrapper_id })
            .append($('<div/>', { class: msg_class, html: localize(message) })));
        ViewPopupUI.showInpagePopup(`<div class="${popupbox_id}">${$con.html()}</div>`, 'message_popup', '#sell_bet_desc');
    };

    const showErrorPopup = (response, message) => {
        message = message || 'Sorry, an error occurred while processing your request.';
        showMessagePopup(localize(message), 'There was an error', 'notice-msg');
        console.log(response);
    };

    const sellSetVisibility = (show) => {
        const sell_wrapper_id = 'sell_at_market_wrapper';
        const sell_button_id = 'sell_at_market';
        const is_exist = $container.find(`#${sell_wrapper_id}`).length > 0;
        if (show) {
            if (is_exist) return;
            if (contract_type === 'spread') {
                $container.find('#contract_sell_wrapper').removeClass(hidden_class).append(
                    $('<p/>', { id: sell_wrapper_id, class: 'button' })
                    .append($('<button/>', { id: sell_button_id, class: 'button', text: localize('Sell') })));
            } else {
                $container.find('#contract_sell_wrapper').removeClass(hidden_class)
                    .append($('<div/>', { id: sell_wrapper_id })
                        .append($('<button/>', { id: sell_button_id, class: 'button', text: localize('Sell at market') }))
                        .append($('<div/>', { class: 'note' })
                            .append($('<strong/>', { text: `${localize('Note')}: ` }))
                            .append($('<span/>', { text: localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.') }))));
            }
            $container.find(`#${sell_button_id}`).unbind('click').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                is_sell_clicked = true;
                sellSetVisibility(false);
                BinarySocket.send({ sell: contract_id, price: contract.bid_price }).then((response) => {
                    responseSell(response);
                });
            });
        } else {
            if (!is_exist) return;
            $container.find(`#${sell_button_id}`).unbind('click');
            $container.find(`#${sell_wrapper_id}`).remove();
        }
    };

    // ===== Requests & Responses =====
    // ----- Get Contract -----
    const getContract = (option) => {
        if (contract_id) {
            ViewPopupUI.forgetStreams();
            const req = {
                proposal_open_contract: 1,
                contract_id           : contract_id,
                subscribe             : 1,
            };
            if (option === 'no-subscribe') delete req.subscribe;
            BinarySocket.send(req, { callback: responseProposal });
        }
    };

    // ----- Corporate Action -----
    const getCorporateActions = () => {
        const epoch = window.time.unix();
        const end_time = epoch < contract.date_expiry ? epoch.toFixed(0) : contract.date_expiry;
        BinarySocket.send({
            get_corporate_actions: '1',
            symbol               : contract.underlying,
            start                : contract.date_start,
            end                  : end_time,
        }).then((response) => {
            responseCorporateActions(response);
        });
    };

    const responseCorporateActions = (response) => {
        if (!isEmptyObject(response.get_corporate_actions)) {
            corporate_action_event = true;
            containerSetText('trade_details_message', contract.validation_error ? contract.validation_error : corporate_action_event ? `* ${localize('This contract was affected by a Corporate Action event.')}` : '&nbsp;');
            populateCorporateAction(response);
            showCorporateAction();
        }
    };

    const responseSell = (response) => {
        if (response.hasOwnProperty('error')) {
            if (response.error.code === 'NoOpenPosition') {
                getContract();
            } else {
                $container.find('#errMsg').text(response.error.message).removeClass(hidden_class);
            }
            sellSetVisibility(true);
            is_sell_clicked = false;
            return;
        }
        ViewPopupUI.forgetStreams();
        $container.find('#errMsg').addClass(hidden_class);
        sellSetVisibility(false);
        if (contract_type === 'spread') {
            getContract();
        } else if (contract_type === 'normal') {
            if (is_sell_clicked) {
                containerSetText('contract_sell_message',
                    `${localize('You have sold this contract at [_1] [_2]', [contract.currency, response.sell.sold_for])}
                    <br />
                    ${localize('Your transaction reference number is [_1]', [response.sell.transaction_id])}`);
            }
            getContract('no-subscribe');
        }
    };

    const responseProposal = (response) => {
        if (response.error) {
            if (response.error.code !== 'AlreadySubscribed' && response.echo_req.contract_id === contract_id) {
                showErrorPopup(response, response.error.message);
            }
            return;
        }
        if (response.proposal_open_contract.contract_id === contract_id) {
            ViewPopupUI.storeSubscriptionID(response.proposal_open_contract.id);
            responseContract(response);
        } else {
            BinarySocket.send({ forget: response.proposal_open_contract.id });
        }
        const dates = ['#trade_details_start_date', '#trade_details_end_date', '#trade_details_current_date', '#trade_details_live_date'];
        for (let i = 0; i < dates.length; i++) {
            showLocalTimeOnHover(dates[i]);
            $(dates[i]).attr('data-balloon-pos', 'left');
        }
    };

    const viewButtonOnClick = (container_selector) => {
        $(container_selector).on('click', '.open_contract_details', function(e) {
            e.preventDefault();
            init(this);
        });
    };

    return {
        init             : init,
        spreadUpdate     : spreadUpdate,
        normalUpdate     : normalUpdate,
        viewButtonOnClick: viewButtonOnClick,
    };
})();

module.exports = ViewPopup;
