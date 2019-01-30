import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import PropTypes                      from 'prop-types';
import PositionsCard                  from './positions_card.jsx';

const CardList = ({ data, currency }) => (
    <div className='card-list'>
        {
            data.map((positions_position, id) => (
                <PositionsCard
                    key={id}
                    {...positions_position}
                    currency={currency}
                />
            ))
        }
    </div>
);

CardList.propTypes = {
    currency: PropTypes.string,
    data    : MobxPropTypes.arrayOrObservableArray,
};

export default CardList;
