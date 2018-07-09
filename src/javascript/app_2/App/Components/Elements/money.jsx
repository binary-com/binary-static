import PropTypes       from 'prop-types';
import React           from 'react';
import { formatMoney } from '../../../../_common/base/currency_base';

const Money = ({
    amount,
    currency,
    is_formatted = true,
}) => (
    <React.Fragment>
        <span className={`symbols ${(currency || 'USD').toLowerCase()}`} />
        {is_formatted ? formatMoney(currency, amount, true) : amount}
    </React.Fragment>
);

Money.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    currency    : PropTypes.string,
    is_formatted: PropTypes.bool,
};

export default Money;
