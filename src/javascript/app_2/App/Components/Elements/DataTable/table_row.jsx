import PropTypes from 'prop-types';
import React     from 'react';
import TableCell from './table_cell.jsx';

const TableRow = ({
    columns,
    is_footer,
    is_header,
    onRowClick,
    row_obj = {},
}) => {
    const onClick = onRowClick ? (() => { onRowClick(row_obj); }) : null;

    return (
        <div className='table__row' onClick={onClick}>
            {columns.map(({ col_index, renderCellContent, title }) => {
                const cell_value = row_obj[col_index] || '';

                return (
                    <TableCell col_index={col_index} key={col_index}>
                        {is_header
                            ? title
                            : renderCellContent
                                ? renderCellContent({ cell_value, col_index, row_obj, is_footer })
                                : cell_value
                        }
                    </TableCell>
                );
            })}
        </div>
    );
};

TableRow.propTypes = {
    columns   : PropTypes.array,
    is_footer : PropTypes.bool,
    is_header : PropTypes.bool,
    onRowClick: PropTypes.func,
    row_obj   : PropTypes.object,
};

export default TableRow;
