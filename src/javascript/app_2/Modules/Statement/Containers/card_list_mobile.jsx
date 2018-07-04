import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import StatementCard                  from '../Components/statement_card.jsx';
import { connect }                    from '../../../Stores/connect';

const CardListMobile = ({ data }) => (
    <div className='card-list'>
        {
            data.map((transaction, id) => (
                <StatementCard className='card-list__card' {...transaction} key={id} />
            ))
        }
    </div>
);

CardListMobile.propTypes = {
    data: MobxPropTypes.arrayOrObservableArray,
};

export default connect(
    ({modules}) => ({
        data: modules.statement.data,
    })
)(CardListMobile);
