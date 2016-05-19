RiskClassification = (function() {
  'use strict';

  var financial_assessment_url = page.url.url_for('user/assessmentws');

  var renderRiskClassificationPopUp = function () {
      $.ajax({
          url: financial_assessment_url,
          dataType: 'html',
          method: 'GET',
          success: function(riskClassificationText) {
              if (riskClassificationText.includes('assessment_form')) {
                  var payload = $(riskClassificationText);
                  showRiskClassificationPopUp(payload.find('#assessment_form'));
                  FinancialAssessmentws.LocalizeText();
                  $('#risk_classification #assessment_form').removeClass('invisible')
                                      .attr('style', 'text-align: left;');
                  $('#risk_classification #high_risk_classification').removeClass('invisible');
                  $('#risk_classification #heading_risk').removeClass('invisible');
                  $("#risk_classification #assessment_form").on("submit",function(event) {
                      event.preventDefault();
                      FinancialAssessmentws.submitForm();
                      return false;
                  });
              }
          },
          error: function(xhr) {
              return;
          }
      });
      $("#risk_classification #assessment_form").on("submit",function(event) {
          event.preventDefault();
          FinancialAssessmentws.submitForm();
          return false;
      });
  };

  var showRiskClassificationPopUp = function (content) {
    if ($('#risk_classification').length > 0) {
        return;
    }
    var lightboxDiv = $("<div id='risk_classification' class='lightbox'></div>");

    var wrapper = $('<div></div>');
    wrapper = wrapper.append(content);
    wrapper = $('<div></div>').append(wrapper);
    wrapper.appendTo(lightboxDiv);
    lightboxDiv.appendTo('body');
  };

  var cleanup = function () {
    localStorage.removeItem('risk_classification');
    localStorage.removeItem('risk_classification.response');
    $('#risk_classification').remove();
    if (sessionStorage.getItem('check_tnc')) {
      page.client.check_tnc();
    }
  };

  return {
    renderRiskClassificationPopUp: renderRiskClassificationPopUp,
    cleanup: cleanup
  };
}());
