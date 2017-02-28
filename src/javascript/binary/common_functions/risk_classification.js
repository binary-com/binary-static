const Client = require('../base/client').Client;

const RiskClassification = (function() {
    'use strict';

    const showRiskClassificationPopUp = function (content) {
        if ($('#risk_classification').length > 0) {
            return;
        }
        const lightboxDiv = $("<div id='risk_classification' class='lightbox'></div>");

        let wrapper = $('<div></div>');
        wrapper = wrapper.append(content);
        wrapper = $('<div></div>').append(wrapper);
        wrapper.appendTo(lightboxDiv);
        lightboxDiv.appendTo('body');
    };

    const cleanup = function () {
        localStorage.removeItem('risk_classification');
        $('#risk_classification').remove();
    };

    return {
        showRiskClassificationPopUp: showRiskClassificationPopUp,
        cleanup                    : cleanup,
    };
})();

module.exports = {
    RiskClassification: RiskClassification,
};
