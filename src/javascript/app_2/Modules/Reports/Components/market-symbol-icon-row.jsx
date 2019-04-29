import PropTypes          from 'prop-types';
import React              from 'react';
import { UnderlyingIcon } from 'App/Components/Elements/underlying-icon.jsx';
import { IconTradeType }  from '../../../Assets/Trading/Types';

const getMarketInformation = (payload) => {
    const { shortcode } = payload;
    const pattern = new RegExp('(^[A-Z]+)_((R_\\d{2,3})|[A-Z]+)'); // Used to get market name from shortcode
    const extracted = pattern.exec(shortcode);
    if (extracted !== null) {
        return {
            category  : extracted[1].toLowerCase(),
            underlying: extracted[2],
        };
    }
    return null;
};

const MarketSymbolIconRow = ({ payload }) => {
    const should_show_category_icon = typeof payload.shortcode === 'string';
    const market_information = getMarketInformation(payload);

    if (should_show_category_icon && market_information) {
        return (
            <React.Fragment>
                <div className='positions-drawer-card__underlying-name'>
                    <UnderlyingIcon market={market_information.underlying} />
                    &nbsp;
                </div>

                <IconTradeType type={market_information.category} />
            </React.Fragment>
        );
    }

    return (
        <svg width='32' height='32' className='unknown-icon'>
            <rect width='32' height='32' />
        </svg>
    );
};

MarketSymbolIconRow.propTypes = {
    action : PropTypes.string,
    payload: PropTypes.object,
};

export default MarketSymbolIconRow;
