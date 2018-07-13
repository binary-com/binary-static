import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import PortfolioCard                  from './portfolio_card.jsx';

const CardList = ({ data, currency }) => (
    <div className='card-list'>
        {
            data.map((transaction, id) => (
                <PortfolioCard
                    key={id}
                    {...transaction}
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