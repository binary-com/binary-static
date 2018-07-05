import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import StatementCard                  from '../Components/statement_card.jsx';

const ListSmallScreen = ({ data }) => (
    <div className='statement statement__content'>
        <div className='card-list'>
            {
                data.map((transaction, id) => (
                    <StatementCard className='card-list__card' {...transaction} key={id} />
                ))
            }
        </div>
    </div>
);

ListSmallScreen.propTypes = {
    data: MobxPropTypes.arrayOrObservableArray,
};

export default ListSmallScreen;
