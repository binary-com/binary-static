import PropTypes         from 'prop-types';
import React             from 'react';

const ComponentTradeCategories = ({ category }) => {
    let TradeTypeComponent;
    if (category) {
        switch (category) {
            case 'rise_fall':
                TradeTypeComponent = (
                    <React.Fragment>
                        <p>
                            If you select "Rise", you win the payout if the exit spot is strictly higher than the barrier.
                        </p>
                        <p>
                            If you select "Fall", you win the payout if the exit spot is strictly lower than the barrier.
                        </p>
                        <p>
                            If the exit spot is equal to the barrier, you don't win the payout.
                        </p>
                    </React.Fragment>
                );
                break;
            case 'high_low':
                TradeTypeComponent = (
                    <React.Fragment>
                        <p>
                            If you select "Higher", you win the payout if the exit spot is strictly higher than the barrier.
                        </p>
                        <p>
                            If you select "Lower", you win the payout if the exit spot is strictly lower than the barrier.
                        </p>
                        <p>
                            If the exit spot is equal to the barrier, you don't win the payout.
                        </p>
                    </React.Fragment>
                );
                break;
            default:
                TradeTypeComponent = (
                    <p>
                        not found
                    </p>
                );
                break;
        }
    }
    return (
        <div>
            {TradeTypeComponent}
        </div>
    );
};

ComponentTradeCategories.propTypes = {
    category: PropTypes.string,
};

export { ComponentTradeCategories };
