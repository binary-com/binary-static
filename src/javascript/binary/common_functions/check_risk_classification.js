var RiskClassification    = require('../common_functions/risk_classification').RiskClassification;
var FinancialAssessmentws = require('../websocket_pages/user/account/settings/financial_assessment').FinancialAssessmentws;
var Client  = require('../base/client').Client;
var url_for = require('../base/url').url_for;

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
                var payload = $(riskClassificationText);
                RiskClassification.showRiskClassificationPopUp(payload.find('#assessment_form'));
                FinancialAssessmentws.LocalizeText();
                $('#risk_classification #assessment_form').removeClass('invisible')
                    .attr('style', 'text-align: left;');
                $('#risk_classification #high_risk_classification').removeClass('invisible');
                $('#risk_classification #heading_risk').removeClass('invisible');
                $('#risk_classification #assessment_form').on('submit', function(event) {
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
    $('#risk_classification #assessment_form').on('submit', function(event) {
        event.preventDefault();
        FinancialAssessmentws.submitForm();
        return false;
    });
}

function qualify_for_risk_classification() {
    if (Client.get_boolean('is_logged_in') && !Client.get_boolean('is_virtual') &&
        Client.get_value('residence') !== 'jp' && !$('body').hasClass('BlueTopBack') && $('#assessment_form').length === 0 &&
        (localStorage.getItem('reality_check.ack') === '1' || !localStorage.getItem('reality_check.interval'))) {
        return true;
    }
    return false;
}

module.exports = {
    check_risk_classification      : check_risk_classification,
    qualify_for_risk_classification: qualify_for_risk_classification,
};
