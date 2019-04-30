import React        from 'react';
import { localize } from '_common/localize';
import Money        from '../../../../App/Components/Elements/money.jsx';

export const contractSold = (currency, sold_for) => ({
    header               : localize('Contract sold'),
    message              : <PortfolioMessage currency={currency} amount={sold_for} text={localize('Contract was sold for ')} />,
    type                 : 'info',
    size                 : 'small',
    should_hide_close_btn: true,
    is_auto_close        : true,
});

const PortfolioMessage = ({ currency, text, amount }) => (
    <React.Fragment>
        <span>{text}</span>
        <Money amount={amount} currency={currency} />
    </React.Fragment>
);
