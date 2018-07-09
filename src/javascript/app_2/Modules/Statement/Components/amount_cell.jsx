import classNames from 'classnames';
import React      from 'react';

const AmountCell = (
    data,
    data_index,
) => {
    const className = +data.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

    return (
        <td key={data_index} className={classNames(`${data_index}`, className)}>
            {data}
        </td>
    );
};

export default AmountCell;
