const RiskClassification  = require('../common_functions/risk_classification').RiskClassification;
const FinancialAssessment = require('../websocket_pages/user/account/settings/financial_assessment');
const objectNotEmpty      = require('../base/utility').objectNotEmpty;
const Client  = require('../base/client').Client;
const State   = require('../base/storage').State;
const url_for = require('../base/url').url_for;

function check_risk_classification() {
    BinarySocket.wait('get_financial_assessment').then(() => {
        if (State.get(['response', 'get_account_status', 'get_account_status', 'risk_classification']) === 'high' &&
            !objectNotEmpty(State.get(['response', 'get_financial_assessment', 'get_financial_assessment'])) &&
            localStorage.getItem('risk_classification') === 'high' &&
            qualify_for_risk_classification()) {
            renderRiskClassificationPopUp();
        }
    });
}

function renderRiskClassificationPopUp() {
    if (/user\/settings\/assessmentws/i.test(window.location.pathname)) {
        window.location.href = url_for('user/settingsws');
        return;
    }
    if ($('#frm_assessment').length) return;

    $.ajax({
        url     : url_for('user/settings/assessmentws'),
        dataType: 'html',
        method  : 'GET',
        success : function(riskClassificationText) {
            const $frm_assessment = $(riskClassificationText).find('#frm_assessment');
            if ($frm_assessment.length) {
                $frm_assessment.removeClass('invisible').attr('style', 'text-align: left;');
                RiskClassification.showRiskClassificationPopUp($frm_assessment);
                const $risk_classification = $('#risk_classification');
                $risk_classification.find('#high_risk_classification, #heading_risk').removeClass('invisible');
                handleForm($risk_classification);
            }
        },
        error: function() {
            return false;
        },
    });
    handleForm($('#risk_classification'));
}

function handleForm($risk_classification) {
    BinarySocket.wait('get_financial_assessment').then(() => {
        FinancialAssessment.handleForm();
        $risk_classification.find('#frm_assessment').on('submit', function(event) {
            event.preventDefault();
            FinancialAssessment.submitForm();
            return false;
        });
    });
}

function qualify_for_risk_classification() {
    return (Client.is_logged_in() && !Client.get('is_virtual') && Client.get('residence') !== 'jp' &&
            (localStorage.getItem('reality_check.ack') === '1' || !localStorage.getItem('reality_check.interval')));
}

module.exports = {
    check_risk_classification      : check_risk_classification,
    qualify_for_risk_classification: qualify_for_risk_classification,
};
