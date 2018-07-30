import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

const TableCell = ({ col_index, children }) => (
    <div className={classNames('table__cell', col_index)}>
        {children}
    </div>
);

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

class DataTable extends React.PureComponent {
    componentDidUpdate() {
        this.alignHeader();
    }

    alignHeader() {
        // scrollbar inside body table can push content (depending on the browser and if mouse is plugged in)
        if (!this.props.data_source.length) return;
        const first_body_row   = this.el_table_body.firstChild;
        const scrollbar_offset = this.el_table_head.offsetWidth - first_body_row.offsetWidth;
        this.el_table_head.style.paddingRight = `${scrollbar_offset}px`;
    }

    render() {
        const {
            children,
            onScroll,
            footer,
            columns,
        } = this.props;

        return (
            <div className='table'>
                <div className='table__head' ref={el => { this.el_table_head = el; }}>
                    <TableRow columns={columns} is_header />
                </div>
                
                <div
                    className='table__body'
                    onScroll={onScroll}
                    ref={el => { this.el_table_body = el; }}
                >
                    {this.props.data_source.map((row_obj, id) =>
                        <TableRow row_obj={row_obj} columns={columns} key={id} />)
                    }
                    {children}
                </div>

                {this.props.footer &&
                    <div className='table__foot'>
                        <TableRow row_obj={footer} columns={columns} is_footer />)}
                    </div>
                }
            </div>
        );
    }
}

DataTable.propTypes = {
    columns    : PropTypes.array,
    data_source: MobxPropTypes.arrayOrObservableArray,
    footer     : PropTypes.object,
    onScroll   : PropTypes.func,
    children   : PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};



export default DataTable;
