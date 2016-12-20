var RiskClassification = (function() {
    'use strict';

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
        showRiskClassificationPopUp: showRiskClassificationPopUp,
        cleanup                    : cleanup,
    };
})();

module.exports = {
    RiskClassification: RiskClassification,
};
