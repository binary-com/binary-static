import React from 'react';

const CardList = ({ data_source, Card }) => (
    <div className='card-list'>
        {
            data_source.map((transaction, id) => (
                <Card className='card-list__card' {...transaction} key={id} />
            ))
        }
    </div>
);

export default CardList;