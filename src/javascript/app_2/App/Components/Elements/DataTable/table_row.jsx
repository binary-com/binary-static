import PropTypes   from 'prop-types';
import React       from 'react';
import { NavLink } from 'react-router-dom';
import TableCell   from './table_cell.jsx';

const TableRow = ({
    to,
    columns,
    is_footer,
    is_header,
    row_obj = {},
}) => {
    const cells = columns.map(({ col_index, renderCellContent, title }) => {
        let cell_content = title;
        if (!is_header) {
            const cell_value = row_obj[col_index] || '';
            cell_content = renderCellContent
                ? renderCellContent({ cell_value, col_index, row_obj, is_footer })
                : cell_value;
        }

        return (
            <TableCell col_index={col_index} key={col_index}>
                {cell_content}
            </TableCell>
        );
    });

    return (
        to ?
            <NavLink className='table__row table__row-link' to={to}>
                {cells}
            </NavLink>
            :
            <div className='table__row'>
                {cells}
            </div>
    );
};

TableRow.propTypes = {
    columns  : PropTypes.array,
    is_footer: PropTypes.bool,
    is_header: PropTypes.bool,
    row_obj  : PropTypes.object,
    to       : PropTypes.string,
};

export default TableRow;
