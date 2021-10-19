const getElementById = require('../../../../../_common/common_functions').getElementById;

const FinancialDetailForm = (() => {

    const init = async (fields) => {
        fields.forEach(field => {
            getElementById(`${field.id}`).value = field.default_value;
            getElementById(`${field.section}_section`).setVisibility(1);
            getElementById(`${field.id}_row`).setVisibility(1);
        });
    };

    return {
        init,
    };
})();

module.exports = FinancialDetailForm;
