import React from 'react';

const CardList = ({ data_source, Card }) => (
    <div className='card-list'>
        {JSON.stringify(data_source[0])}
        <Card {...data_source[0]} />
        {
            data_source.map((transaction, id) => {
                <Card className='card-list__card' {...transaction} key={id} />;
            })
        }
    </div>
);

export default CardList;