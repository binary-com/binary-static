import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import PropTypes                      from 'prop-types';
import StatementCard                  from '../Components/statement_card.jsx';

const StatementCardList = ({ data, onScroll, children }) => (
    <div className='card-list' onScroll={onScroll}>
        {
            data.map((transaction, id) => (
                <StatementCard className='card-list__card' {...transaction} key={id} />
            ))
        }
        {children}
    </div>
);

StatementCardList.propTypes = {
    data    : MobxPropTypes.arrayOrObservableArray,
    onScroll: PropTypes.func,
    children   : PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

export default StatementCardList;
