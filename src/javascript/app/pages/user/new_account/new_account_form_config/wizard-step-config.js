const addressDetailsConfig = require('./address-details-config');
const currencySelectorConfig = require('./currency-selector-config');
const financialDetailsConfig = require('./financial-details-config');
const personalDetailsConfig = require('./personal-details-config');
const termsOfUseConfig = require('./terms-of-use-config');

const shouldShowFinancialDetails = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';
const shouldShowPersonalAndAddressDetailsAndCurrency = ({ real_account_signup_target }) => real_account_signup_target !== 'samoa';

const getSteps = props => [
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [currencySelectorConfig(props)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [personalDetailsConfig(props)] : []),
    ...(shouldShowPersonalAndAddressDetailsAndCurrency(props) ? [addressDetailsConfig(props)] : []),
    ...(shouldShowFinancialDetails(props) ? [financialDetailsConfig(props)] : []),
    termsOfUseConfig(props),
];

module.exports = getSteps;
