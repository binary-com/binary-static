const RealityCheckData     = require('./reality_check.data');
const BinarySocket         = require('../../socket');
const showLocalTimeOnHover = require('../../../base/clock').showLocalTimeOnHover;
const urlFor               = require('../../../base/url').urlFor;
const FormManager          = require('../../../common_functions/form_manager');
require('../../../../lib/polyfills/array.includes');
require('../../../../lib/polyfills/string.includes');

const RealityCheckUI = (() => {
    'use strict';

    const summary_url = urlFor('user/reality_check_summary');
    const frequency_url = urlFor('user/reality_check_frequency');
    const form = {
        selector            : '#frm_reality_check',
        num_reality_duration: '#num_reality_duration',
    };

    let login_time; // milliseconds

    const getAjax = (summary) => {
        $.ajax({
            url     : summary ? summary_url : frequency_url,
            dataType: 'html',
            method  : 'GET',
            success : (reality_check_text) => {
                ajaxSuccess(reality_check_text, summary);
            },
        });
    };

    const ajaxSuccess = (reality_check_text, summary) => {
        const content = 'reality_check_content';
        if (reality_check_text.includes(content) && $('#reality_check').length === 0) {
            $('body').append($('<div/>', { id: 'reality_check', class: 'lightbox' })
                .append($('<div />').append($('<div />')
                .append($(reality_check_text).find(`#${content}`)))));
            $(form.num_reality_duration).val(Math.floor(+RealityCheckData.get('interval') / 60 / 1000));
            $('#statement').off('click').on('click dblclick', onStatementClick);
            $('#logout').off('click').on('click dblclick', onLogoutClick);
            if (summary) {
                updateSummary(summary);
            }
            bindValidation();
        }
    };

    const updateSummary = (summary) => {
        $('#start_time').text(summary.start_time_string);
        $('#login_time').text(summary.login_time);
        $('#current_time').text(summary.current_time);
        $('#session_duration').text(summary.session_duration);

        $('#loginid').text(summary.loginid);
        $('#rc_currency').text(summary.currency);
        $('#turnover').text(summary.turnover);
        $('#profit_loss').text(summary.profit_loss);
        $('#bought').text(summary.contracts_bought);
        $('#sold').text(summary.contracts_sold);
        $('#open').text(summary.open_contracts);
        $('#potential').text(summary.potential_profit);

        showLocalTimeOnHover('#start_time, #login_time, #current_time');
    };

    const handleKeypress = (ev) => {
        const char = String.fromCharCode(ev.which);
        if ((!/[0-9]/.test(char) && [8, 37, 39].indexOf(ev.keyCode) < 0) ||
            /['%]/.test(char)) { // similarity to arrows key code in some browsers
            ev.returnValue = false;
            ev.preventDefault();
        }
    };

    const bindValidation = () => {
        $(form.num_reality_duration).off('keypress').on('keypress', handleKeypress);
        FormManager.init(form.selector, [
            { selector: form.num_reality_duration, validations: ['req', ['number', { min: 10, max: 60 }]], exclude_request: 1, no_scroll: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : form.selector,
            fnc_response_handler: responseHandler,
        });
    };

    const responseHandler = () => {
        const interval_minute = +($(form.num_reality_duration).val());
        RealityCheckData.set('interval', interval_minute * 60 * 1000);
        RealityCheckData.set('keep_open', 0);
        RealityCheckData.set('ack', 1);
        closePopUp();
    };

    const onStatementClick = () => {
        const win = window.open(`${urlFor('user/statementws')}#no-reality-check`, '_blank');
        if (win) {
            win.focus();
        }
    };

    const onLogoutClick = () => {
        BinarySocket.send({ logout: '1' });
    };

    const closePopUp = () => {
        $('#reality_check').remove();
        startSummaryTimer();
    };

    const startSummaryTimer = () => {
        const interval = +RealityCheckData.get('interval');
        const toWait = interval - ((Date.now() - login_time) % interval);

        setTimeout(() => {
            RealityCheckData.set('keep_open', 1);
            getSummaryAsync();
        }, toWait);
    };

    const shouldShowPopup = () => {
        const location = window.location;
        return !(/no-reality-check/.test(location.hash) && /statementws/.test(location.pathname));
    };

    const getSummaryAsync = () => {
        if (RealityCheckUI.shouldShowPopup()) {
            BinarySocket.send({ reality_check: 1 }).then((response) => {
                getAjax(RealityCheckData.summaryData(response.reality_check));
            });
        }
    };

    return {
        renderFrequencyPopUp: () => { getAjax(); },
        closePopUp          : closePopUp,
        startSummaryTimer   : startSummaryTimer,
        getSummaryAsync     : getSummaryAsync,
        setLoginTime        : (time) => { login_time = time; },
        shouldShowPopup     : shouldShowPopup,
    };
})();

module.exports = RealityCheckUI;
