import React      from 'react';
import classnames from 'classnames';

const AmountCell = (
    data,
    data_index,
) => {
    const className = +data.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

    return (
        <td key={data_index} className={classnames(`${data_index}`, className)}>
            {data}
        </td>
    );
};

export default AmountCell;
