const Portfolio           = require('./account/portfolio').Portfolio;
const ViewPopup           = require('./view_popup/view_popup');
const BinarySocket        = require('../socket');
const localize            = require('../../base/localize').localize;
const showLoadingImage    = require('../../base/utility').showLoadingImage;
const formatMoney         = require('../../common_functions/currency').formatMoney;
const toTitleCase         = require('../../common_functions/string_util').toTitleCase;

const ICOPortfolio = (() => {
    'use strict';

    let values,
        is_initialized,
        is_first_response;

    const init = () => {
        if (is_initialized) return;

        values = {};
        const $portfolio_loading = $('#portfolio-loading');
        $portfolio_loading.show();
        showLoadingImage($portfolio_loading);
        is_first_response = true;
        BinarySocket.send({ portfolio: 1 }).then((response) => {
            updatePortfolio(response);
        });
        // Subscribe to transactions to auto update new purchases
        BinarySocket.send({ transaction: 1, subscribe: 1 }, { callback: transactionResponseHandler });
        is_initialized = true;
    };

    const createPortfolioRow = (data, is_first) => {
        const long_code = data.longcode;

        const new_class = is_first ? '' : 'new';
        const status = /bidding/i.test(long_code) ? 'Cancel Bid' : (/unsuccessful/i.test(long_code) ? 'Refund Bid' : (/successful/i.test(long_code) ? 'Claim Tokens' : 'Ended'));
        const button_class = /(cancel|end)/i.test(status) ? 'button-secondary' : '';
        const $div = $('<div/>');
        $div.append($('<tr/>', { class: `tr-first ${new_class} ${data.contract_id}`, id: data.contract_id })
            .append($('<td/>', { class: 'ref', text: data.transaction_id }))
            .append($('<td/>', { class: 'payout' }).append($('<strong/>', { text: data.shortcode.split('_')[2] })))
            .append($('<td/>', { class: 'purchase' }).append($('<strong/>', { text: formatMoney(data.currency, data.buy_price) })))
            .append($('<td/>', { class: 'details', text: toTitleCase(long_code) }))
            .append($('<td/>', { class: 'button' }).append($('<button/>', { class: `button ${button_class} nowrap`, contract_id: data.contract_id, text: localize(status) }))))
            .append($('<tr/>', { class: `tr-desc ${new_class} ${data.contract_id}` }).append($('<td/>', { colspan: '6', text: long_code })));
        $('#portfolio-body').prepend($div.html());
    };

    const updatePortfolio = (data) => {
        if (data.hasOwnProperty('error')) {
            errorMessage(data.error.message);
            return;
        }

        let portfolio_data;
        if (data.portfolio.contracts.length !== 0) {
            /**
             * User has at least one contract
             **/
            $('#portfolio-no-contract').hide();
            $.each(data.portfolio.contracts, (ci, c) => {
                if (!values.hasOwnProperty(c.contract_id) && c.contract_type === 'BINARYICO') {
                    values[c.contract_id] = {};
                    values[c.contract_id].buy_price = c.buy_price;
                    portfolio_data = Portfolio.getPortfolioData(c);
                    createPortfolioRow(portfolio_data, is_first_response);
                    setTimeout(() => {
                        $(`tr.${c.contract_id}`).removeClass('new');
                    }, 1000);
                }
            });
        }
        // no open contracts
        if (!portfolio_data) {
            $('#portfolio-no-contract').show();
            $('#portfolio-table').setVisibility(0);
        } else {
            $('#portfolio-table').setVisibility(1);
        }
        // ready to show portfolio table
        $('#portfolio-loading').hide();
        $('#portfolio-content').setVisibility(1);
        is_first_response = false;
    };

    const transactionResponseHandler = (response) => {
        if (response.hasOwnProperty('error')) {
            errorMessage(response.error.message);
        } else if (response.transaction.action === 'buy') {
            BinarySocket.send({ portfolio: 1 }).then((res) => {
                updatePortfolio(res);
            });
        } else if (response.transaction.action === 'sell') {
            removeContract(response.transaction.contract_id);
        }
    };

    const removeContract = (contract_id) => {
        delete (values[contract_id]);
        $(`tr.${contract_id}`)
            .removeClass('new')
            .css('opacity', '0.5')
            .fadeOut(1000, function() {
                $(this).remove();
                if ($('#portfolio-body').find('tr').length === 0) {
                    $('#portfolio-table').setVisibility(0);
                    $('#cost-of-open-positions, #value-of-open-positions').text('');
                    $('#portfolio-no-contract').show();
                }
            });
    };

    const errorMessage = (msg) => {
        const $err = $('#portfolio').find('#error-msg');
        if (msg) {
            $err.setVisibility(1).text(msg);
        } else {
            $err.setVisibility(0).text('');
        }
    };

    const onLoad = () => {
        init();
        ViewPopup.viewButtonOnClick('#portfolio-table');
    };

    const onUnload = () => {
        BinarySocket.send({ forget_all: 'transaction' });
        $('#portfolio-body').empty();
        $('#portfolio-content').setVisibility(0);
        is_initialized = false;
    };

    return {
        updatePortfolio           : updatePortfolio,
        transactionResponseHandler: transactionResponseHandler,
        onLoad                    : onLoad,
        onUnload                  : onUnload,
    };
})();

module.exports = ICOPortfolio;
