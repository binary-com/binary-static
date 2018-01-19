const Portfolio        = require('./account/portfolio/portfolio').Portfolio;
const ViewPopup        = require('./view_popup/view_popup');
const BinarySocket     = require('../../base/socket');
const loadUrl          = require('../../base/binary_pjax').load;
const formatMoney      = require('../../common/currency').formatMoney;
const Validation       = require('../../common/form_validation');
const urlFor           = require('../../../_common/url').urlFor;
const localize         = require('../../../_common/localize').localize;
const State            = require('../../../_common/storage').State;
const getPropertyValue = require('../../../_common/utility').getPropertyValue;
const showLoadingImage = require('../../../_common/utility').showLoadingImage;

const ICOPortfolio = (() => {
    let values,
        is_initialized,
        is_first_response;

    const init = () => {
        if (is_initialized) return;

        values = {};
        const $portfolio_loading = $('#portfolio-loading');
        $portfolio_loading.show();
        showLoadingImage($portfolio_loading[0]);
        is_first_response = true;
        BinarySocket.send({ portfolio: 1 }).then((response) => {
            updatePortfolio(response);
        });
        // Subscribe to transactions to auto update new purchases
        BinarySocket.send({ transaction: 1, subscribe: 1 }, { callback: transactionResponseHandler });
        is_initialized = true;
    };

    const createPortfolioRow = (data, is_first) => {
        const long_code         = data.longcode;
        const shortcode         = data.shortcode.split('_');
        const ico_status        = (State.getResponse('ico_status.ico_status') || '').toLowerCase();
        const final_price       = +State.getResponse('ico_status.final_price');
        const is_claim_allowed  = State.getResponse('ico_status.is_claim_allowed');
        const bid               = +shortcode[1];
        const pending_text      = localize('The auction has ended. As the minimum target was not reached, all investors will receive a refund on their active bids.');
        const pending_claim_msg = `data-balloon="${pending_text}" data-balloon-length="large" data-balloon-pos="left"`;

        let status_text = localize('Pending');
        let button_class = 'button-secondary';
        let action = '';
        let is_pending = false;
        if (ico_status === 'closed' && final_price > bid && is_claim_allowed) {
            status_text = localize('Refund Bid');
            action = 'refund';
            button_class = 'button';
        } else if (ico_status === 'closed' && final_price <= bid && is_claim_allowed) {
            status_text = localize('Claim Tokens');
            action = 'claim';
        } else if (ico_status === 'closed' && !is_claim_allowed) {
            is_pending = true;
        } else if (ico_status === 'open') {
            status_text = localize('Cancel Bid');
            action = 'cancel';
        }

        const new_class = is_first ? '' : 'new';
        const status    = status_text;
        const buy_price = +shortcode[1] * +shortcode[2];
        const $div      = $('<div/>');
        if (+State.getResponse('ico_status.final_price') === 0) {
            button_class = 'button-disabled';
        }

        const $button = $('<a/>', { class: `${button_class} nowrap`, contract_id: data.contract_id, tokens: shortcode[2],action});
        $button.append($(`<span ${is_pending && pending_claim_msg}>${localize(status)}</span>`));

        $div.append($('<tr/>', { class: `tr-first ${new_class} ${data.contract_id}`, id: data.contract_id })
            .append($('<td/>', { class: 'ref', text: data.transaction_id }))
            .append($('<td/>', { class: 'payout' }).append($('<strong/>', { text: shortcode[2] })))
            .append($('<td/>', { class: 'bid' }).append($('<strong/>', { html: formatMoney(data.currency, +shortcode[1]) })))
            .append($('<td/>', { class: 'purchase' }).append($('<strong/>', { html: formatMoney(data.currency, buy_price) })))
            .append($('<td/>', { class: 'deposit' }).append($('<strong/>', { html: formatMoney(data.currency, data.buy_price) })))
            .append($('<td/>', { class: 'details', text: long_code }))
            .append($('<td/>', { class: 'button' }).append($button)))
            .append($('<tr/>', { class: `tr-desc ${new_class} ${data.contract_id}` }).append($('<td/>', { colspan: '6', text: long_code })));
        $('#portfolio-body').prepend($div.html());
    };

    const updatePortfolio = (data) => {
        if (getPropertyValue(data, 'error')) {
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
                if (!getPropertyValue(values, c.contract_id) && c.contract_type === 'BINARYICO') {
                    values[c.contract_id]           = {};
                    values[c.contract_id].buy_price = c.buy_price;
                    portfolio_data                  = Portfolio.getPortfolioData(c);
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
            // Cancel bid
            $('a[action="cancel"]:not(.button-disabled)').on('click', function (e) {
                e.preventDefault();
                const contract_id = $(this).attr('contract_id');
                cancelBid(contract_id);
            });
            // Refund Bid
            $('a[action="refund"]:not(.button-disabled)').on('click', function (e) {
                e.preventDefault();
                BinarySocket.send({
                    sell : $(this).attr('contract_id'),
                    price: 0,
                });
            });
            // Claim bid
            $('a[action="claim"]:not(.button-disabled)')
                .off('click')
                .on('click', (e) => {
                    e.preventDefault();
                    const url = urlFor('user/ico-claim-form');
                    // set the contract id for ico-claim-form page.
                    const $col        = $(e.target).parent();
                    const contract_id = $col.attr('contract_id');
                    const tokens      = $col.attr('tokens');
                    State.set('ico_contract_id', contract_id);
                    State.set('ico_token_count', tokens);
                    loadUrl(url);
                });

            $('#portfolio-table').setVisibility(1);
        }
        // ready to show portfolio table
        $('#portfolio-loading').hide();
        $('#portfolio-content').setVisibility(1);
        is_first_response = false;
    };

    const cancelBid = (contract_id) => {
        const lightbox = $('#cancel_bid_confirmation');
        document.body.appendChild(lightbox[0]);
        lightbox.setVisibility(1);
        lightbox.find('.error-msg').addClass('invisible');
        lightbox.find('#chk_confirm').prop('checked', false);

        const confirm_form_id = '#frm_confirm';
        if (!lightbox.find(confirm_form_id).hasClass('validation_initialized')) {
            Validation.init(confirm_form_id, [
                { selector: '#chk_confirm', validations: [['req', { hide_asterisk: true }]] },
            ]);
            lightbox.find(confirm_form_id).addClass('validation_initialized');
        }
        lightbox.find('#cancel').off('click').on('click', () => lightbox.setVisibility(0));
        lightbox.find(confirm_form_id)
            .off('submit')
            .on('submit', (e) => {
                e.preventDefault();
                if (Validation.validate(confirm_form_id)) {
                    lightbox.setVisibility(0);
                    BinarySocket.send({
                        sell : contract_id,
                        price: 0,
                    });
                }
            });
    };

    const transactionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error')) {
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
            .fadeOut(1000, function () {
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
        onLoad,
        onUnload,
    };
})();

module.exports = ICOPortfolio;
