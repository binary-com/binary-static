import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import StatementCard                  from '../Components/statement_card.jsx';

const StatementCardList = ({ data }) => (
    <div className='statement__content'>
        <div className='card-list'>
            {
                data.map((transaction, id) => (
                    <StatementCard className='card-list__card' {...transaction} key={id} />
                ))
            }
        </div>
    </div>
);

StatementCardList.propTypes = {
    data: MobxPropTypes.arrayOrObservableArray,
};

export default StatementCardList;
