import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import PortfolioCard                  from './portfolio_card.jsx';

const CardList = ({ data, currency }) => (
    <div className='card-list'>
        {
            data.map((portfolio_position, id) => (
                <PortfolioCard
                    key={id}
                    {...portfolio_position}
                    currency={currency}
                />
            ))
        }
    </div>
);

CardList.propTypes = {
    data: MobxPropTypes.arrayOrObservableArray,
};

export default CardList;