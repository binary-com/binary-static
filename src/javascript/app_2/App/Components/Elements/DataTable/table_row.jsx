import React     from 'react';
import PropTypes from 'prop-types';
import TableCell from './table_cell.jsx';

const TableRow = ({ columns, row_obj = {}, is_header, is_footer }) => (
    <div className='table__row'>
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

TableRow.propTypes = {
    columns  : PropTypes.array,
    row_obj  : PropTypes.object,
    is_header: PropTypes.bool,
    is_footer: PropTypes.bool,
};

export default TableRow;