import PropTypes         from 'prop-types';
import React             from 'react';
import ImageEvenOdd      from 'Images/app_2/trade_explanations/img-even-odd.svg';
import ImageHigherLower  from 'Images/app_2/trade_explanations/img-higher-lower.svg';
import ImageMatches      from 'Images/app_2/trade_explanations/img-matches-differs.svg';
import ImageOverUnder    from 'Images/app_2/trade_explanations/img-over-under.svg';
import ImageRiseFall     from 'Images/app_2/trade_explanations/img-rise-fall.svg';
import ImageTouch        from 'Images/app_2/trade_explanations/img-touch-no-touch.svg';

const TradeCategoriesGIF = ({ className, category }) => {
    let TradeTypeGIF;
    if (category) {
        switch (category) {
            case ('rise_fall' || 'rise_fall_equal'):
                TradeTypeGIF = (<ImageRiseFall className={className} />);
                break;
            case 'high_low':
                TradeTypeGIF = (<ImageHigherLower className={className} />);
                break;
            case 'match_diff':
                TradeTypeGIF = (<ImageMatches className={className} />);
                break;
            case 'even_odd':
                TradeTypeGIF = (<ImageEvenOdd className={className} />);
                break;
            case 'over_under':
                TradeTypeGIF = (<ImageOverUnder className={className} />);
                break;
            case 'touch':
                TradeTypeGIF = (<ImageTouch className={className} />);
                break;
            default:
                TradeTypeGIF = null;
                break;
        }
    }
    return (
        <React.Fragment>
            {TradeTypeGIF}
        </React.Fragment>
    );
};

TradeCategoriesGIF.propTypes = {
    category : PropTypes.string,
    className: PropTypes.string,
};

export { TradeCategoriesGIF };
