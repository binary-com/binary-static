import React from 'react';
import StatementCard from './statement_card.jsx';
import { connect }       from '../../../Stores/connect';

const CardList = ({
    data,
}) => (
    <div className='card-list'>
        {
            data.map((transaction, id) => (
                <StatementCard className='card-list__card' {...transaction} key={id} />
            ))
        }
    </div>
);

export default connect(
    ({modules}) => ({
        data: modules.statement.data,
    })
)(CardList);
