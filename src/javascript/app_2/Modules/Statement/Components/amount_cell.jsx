import React from 'react';

const AmountCell = (data, data_index) => {
    const class_name = `${data_index} ${+data.replace(/,/g, '') >= 0 ? 'profit' : 'loss'}`;

    return (
        <td key={data_index} className={class_name}>
            {data}
        </td>
    );
};

export default AmountCell;
