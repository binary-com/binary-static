const showLoadingImage    = require('../../../../base/utility').showLoadingImage;
const toJapanTimeIfNeeded = require('../../../../base/clock').toJapanTimeIfNeeded;
const format_money        = require('../../../../common_functions/currency_to_symbol').format_money;
const buildOauthApps      = require('../../../../common_functions/get_app_details').buildOauthApps;
const addTooltip          = require('../../../../common_functions/get_app_details').addTooltip;
const showTooltip         = require('../../../../common_functions/get_app_details').showTooltip;
const japanese_client     = require('../../../../common_functions/country_base').japanese_client;
const Portfolio           = require('../portfolio').Portfolio;
const ViewPopupWS         = require('../../view_popup/view_popupws');
const State               = require('../../../../base/storage').State;
const localize = require('../../../../base/localize').localize;
const Client   = require('../../../../base/client');
const url      = require('../../../../base/url').url;

const PortfolioWS = (function() {
    'use strict';

    let values,
        currency,
        oauth_apps,
        hidden_class,
        is_initialized,
        is_first_response;

    const init = function() {
        hidden_class = 'invisible';
        updateBalance();

        if (is_initialized) return;

        values = {};
        currency = '';
        oauth_apps = {};
        const $portfolio_loading = $('#portfolio-loading');
        $portfolio_loading.show();
        showLoadingImage($portfolio_loading);
        is_first_response = true;
        BinarySocket.send({ portfolio: 1 });
        // Subscribe to transactions to auto update new purchases
        BinarySocket.send({ transaction: 1, subscribe: 1 });
        BinarySocket.send({ oauth_apps: 1 });
        is_initialized = true;

        // Display ViewPopup according to contract_id in query string
        const contract_id = url.param('contract_id');
        if (contract_id) {
            ViewPopupWS.init($('<div />', { contract_id: contract_id }).get(0));
        }
    };

    const createPortfolioRow = function(data, is_first) {
        const longCode = typeof module !== 'undefined' ?
            data.longcode :
            (japanese_client() ? toJapanTimeIfNeeded(undefined, undefined, data.longcode) : data.longcode);

        const new_class = is_first ? '' : 'new';
        $('#portfolio-body').prepend(
            $('<tr class="tr-first ' + new_class + ' ' + data.contract_id + '" id="' + data.contract_id + '">' +
                '<td class="ref"><span' + showTooltip(data.app_id, oauth_apps[data.app_id]) + ' data-balloon-pos="right">' + data.transaction_id + '</span></td>' +
                '<td class="payout"><strong>' + format_money(data.currency, data.payout) + '</strong></td>' +
                '<td class="details">' + longCode + '</td>' +
                '<td class="purchase"><strong>' + format_money(data.currency, data.buy_price) + '</strong></td>' +
                '<td class="indicative"><strong class="indicative_price">--.--</strong></td>' +
                '<td class="button"><button class="button open_contract_detailsws nowrap" contract_id="' + data.contract_id + '">' + localize('View') + '</button></td>' +
                '</tr>' +
                '<tr class="tr-desc ' + new_class + ' ' + data.contract_id + '">' +
                '<td colspan="6">' + longCode + '</td>' +
                '</tr>'));
    };

    const updateBalance = function() {
        const $portfolio_balance = $('#portfolio-balance');
        if ($portfolio_balance.length === 0) return;
        $portfolio_balance.text(Portfolio.getBalance(Client.get('balance'), Client.get('currency')));
        const $if_balance_zero = $('#if-balance-zero');
        if (Client.get('balance') > 0 || Client.get('is_virtual')) {
            $if_balance_zero.addClass(hidden_class);
        } else {
            $if_balance_zero.removeClass(hidden_class);
        }
    };

    const updatePortfolio = function(data) {
        if (data.hasOwnProperty('error')) {
            errorMessage(data.error.message);
            return;
        }

        // no open contracts
        if (data.portfolio.contracts.length === 0) {
            $('#portfolio-no-contract').show();
            $('#portfolio-table').addClass(hidden_class);
        } else {
            /**
             * User has at least one contract
             **/
            $('#portfolio-no-contract').hide();
            let portfolio_data;
            $.each(data.portfolio.contracts, function(ci, c) {
                if (!values.hasOwnProperty(c.contract_id)) {
                    values[c.contract_id] = {};
                    values[c.contract_id].buy_price = c.buy_price;
                    portfolio_data = Portfolio.getPortfolioData(c);
                    currency = portfolio_data.currency;
                    createPortfolioRow(portfolio_data, is_first_response);
                    setTimeout(function() {
                        $('tr.' + c.contract_id).removeClass('new');
                    }, 1000);
                }
            });
            $('#portfolio-table').removeClass(hidden_class);

            // update footer area data
            updateFooter();

            // request "proposal_open_contract"
            BinarySocket.send({ proposal_open_contract: 1, subscribe: 1 });
        }
        // ready to show portfolio table
        $('#portfolio-loading').hide();
        $('#portfolio-content').removeClass(hidden_class);
        is_first_response = false;
    };

    const transactionResponseHandler = function(response) {
        if (response.hasOwnProperty('error')) {
            errorMessage(response.error.message);
        } else if (response.transaction.action === 'buy') {
            BinarySocket.send({ portfolio: 1 });
        } else if (response.transaction.action === 'sell') {
            removeContract(response.transaction.contract_id);
        }
    };

    const updateIndicative = function(data) {
        if (data.hasOwnProperty('error') || !values) {
            return;
        }

        const proposal = Portfolio.getProposalOpenContract(data.proposal_open_contract);
        // avoid updating 'values' before the new contract row added to the table
        if (!values.hasOwnProperty(proposal.contract_id)) {
            return;
        }

        // force to sell the expired contract, in order to remove from portfolio
        if (+proposal.is_settleable === 1 && !proposal.is_sold) {
            BinarySocket.send({ sell_expired: 1 });
        }
        const $td = $('#' + proposal.contract_id + ' td.indicative');

        const old_indicative = values[proposal.contract_id].indicative || 0.00;
        values[proposal.contract_id].indicative = proposal.bid_price;

        let status_class = '',
            no_resale_html = '';
        if (+proposal.is_sold === 1) {
            removeContract(proposal.contract_id);
        } else {
            if (+proposal.is_valid_to_sell !== 1) {
                no_resale_html = '<span>' + localize('Resale not offered') + '</span>';
                $td.addClass('no_resale');
            } else {
                status_class = values[proposal.contract_id].indicative < old_indicative ? ' price_moved_down' : (values[proposal.contract_id].indicative > old_indicative ? ' price_moved_up' : '');
                $td.removeClass('no_resale');
            }
            $td.html('<strong class="indicative_price' + status_class + '"">' + format_money(proposal.currency, values[proposal.contract_id].indicative) + '</strong>' + no_resale_html);
        }

        updateFooter();
    };

    const updateOAuthApps = function(response) {
        oauth_apps = buildOauthApps(response.oauth_apps);
        addTooltip(oauth_apps);
    };

    const removeContract = function(contract_id) {
        delete (values[contract_id]);
        $('tr.' + contract_id)
            .removeClass('new')
            .css('opacity', '0.5')
            .fadeOut(1000, function() {
                $(this).remove();
                if ($('#portfolio-body').find('tr').length === 0) {
                    $('#portfolio-table').addClass(hidden_class);
                    $('#cost-of-open-positions, #value-of-open-positions').text('');
                    $('#portfolio-no-contract').show();
                }
            });
        updateFooter();
    };

    const updateFooter = function() {
        $('#cost-of-open-positions').text(format_money(currency, Portfolio.getSumPurchase(values)));
        $('#value-of-open-positions').text(format_money(currency, Portfolio.getIndicativeSum(values)));
    };

    const errorMessage = function(msg) {
        const $err = $('#portfolio').find('#error-msg');
        if (msg) {
            $err.removeClass(hidden_class).text(msg);
        } else {
            $err.addClass(hidden_class).text('');
        }
    };

    const onLoad = function() {
        if (!State.get('is_beta_trading') && !State.get('is_mb_trading')) {
            BinarySocket.init({
                onmessage: function(msg) {
                    const response = JSON.parse(msg.data),
                        msg_type = response.msg_type;

                    switch (msg_type) {
                        case 'portfolio':
                            PortfolioWS.updatePortfolio(response);
                            break;
                        case 'transaction':
                            PortfolioWS.transactionResponseHandler(response);
                            break;
                        case 'proposal_open_contract':
                            PortfolioWS.updateIndicative(response);
                            break;
                        case 'oauth_apps':
                            PortfolioWS.updateOAuthApps(response);
                            break;
                        default:
                            // msg_type is not what PortfolioWS handles, so ignore it.
                    }
                },
            });
        }
        PortfolioWS.init();
        ViewPopupWS.viewButtonOnClick('#portfolio-table');
    };

    const onUnload = function() {
        BinarySocket.send({ forget_all: 'proposal_open_contract' });
        BinarySocket.send({ forget_all: 'transaction' });
        $('#portfolio-body').empty();
        $('#portfolio-content').addClass(hidden_class);
        is_initialized = false;
    };

    return {
        init                      : init,
        updateBalance             : updateBalance,
        updatePortfolio           : updatePortfolio,
        updateIndicative          : updateIndicative,
        updateOAuthApps           : updateOAuthApps,
        transactionResponseHandler: transactionResponseHandler,
        onLoad                    : onLoad,
        onUnload                  : onUnload,
    };
})();

module.exports = PortfolioWS;
