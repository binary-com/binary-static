const RiskClassification    = require('../common_functions/risk_classification').RiskClassification;
const FinancialAssessmentws = require('../websocket_pages/user/account/settings/financial_assessment').FinancialAssessmentws;
const Client  = require('../base/client').Client;
const url_for = require('../base/url').url_for;

function check_risk_classification() {
    if (localStorage.getItem('risk_classification.response') === 'high' &&
        localStorage.getItem('risk_classification') === 'high' &&
        qualify_for_risk_classification()) {
        renderRiskClassificationPopUp();
    }
}

function renderRiskClassificationPopUp() {
    if (window.location.pathname === '/user/settings/assessmentws') {
        window.location.href = url_for('user/settingsws');
        return;
    }
    $.ajax({
        url     : url_for('user/settings/assessmentws'),
        dataType: 'html',
        method  : 'GET',
        success : function(riskClassificationText) {
            if (riskClassificationText.includes('assessment_form')) {
                const payload = $(riskClassificationText);
                RiskClassification.showRiskClassificationPopUp(payload.find('#assessment_form'));
                const $risk_classification = $('#risk_classification');
                $risk_classification.find('#assessment_form').removeClass('invisible')
                    .attr('style', 'text-align: left;');
                $risk_classification.find('#high_risk_classification').removeClass('invisible');
                $risk_classification.find('#heading_risk').removeClass('invisible');
                $risk_classification.find('#assessment_form').on('submit', function(event) {
                    event.preventDefault();
                    FinancialAssessmentws.submitForm();
                    return false;
                });
            }
        },
        error: function() {
            return false;
        },
    });
    $('#risk_classification').find('#assessment_form').on('submit', function(event) {
        event.preventDefault();
        FinancialAssessmentws.submitForm();
        return false;
    });
}

function qualify_for_risk_classification() {
    return (Client.is_logged_in() && !Client.get('is_virtual') &&
            Client.get('residence') !== 'jp' && !$('body').hasClass('BlueTopBack') && $('#assessment_form').length === 0 &&
            (localStorage.getItem('reality_check.ack') === '1' || !localStorage.getItem('reality_check.interval')));
}

module.exports = {
    check_risk_classification      : check_risk_classification,
    qualify_for_risk_classification: qualify_for_risk_classification,
};
