import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.Component {
    renderRow(transaction, is_footer = false, id = 0) {
        if (!transaction) return null;

        return (
            <tr className='table-row' key={id}>
                {this.props.columns.map(({ col_index, renderCellContent }) => {
                    const cell_value = transaction[col_index] || '';

                    return (
                        <td className={col_index} key={col_index}>
                            {renderCellContent
                                ? renderCellContent(cell_value, col_index, transaction, is_footer)
                                : cell_value
                            }
                        </td>
                    );
                })}
            </tr>
        );
    }

    renderBodyRows() {
        return this.props.data_source
            .map((transaction, id) => this.renderRow(transaction, false, id));
    }

    renderHeaders() {
        return this.props.columns.map(col => <th className={col.col_index} key={col.col_index}>{col.title}</th>);
    }

    renderTableClone() {
        /*
            cloned table with one row for fixed header
            inspired by
            https://stackoverflow.com/questions/4709390
        */
        return (
            <table className={classNames('table', 'table-clone', 'container', { 'table--full-width': this.props.is_full_width })}>
                <thead className='table-head'>
                    <tr className='table-row'>
                        {this.renderHeaders()}
                    </tr>
                </thead>

                <tbody className='table-body'>
                    {this.renderRow(this.props.data_source[0])}
                </tbody>
            </table>
        );
    }

    render() {
        const table_class = classNames('table', {
            'table--fixed-header': this.props.has_fixed_header,
        });
        return (
            <div className='table-container'>
                {this.props.has_fixed_header && this.renderTableClone()}

                <table className={table_class}>
                    <thead className='table-head'>
                        <tr className='table-row'>
                            {this.renderHeaders()}
                        </tr>
                    </thead>

                    {this.props.footer &&
                        <tfoot className='table-foot'>
                            {this.renderRow(this.props.footer, true)}
                        </tfoot>
                    }

                    <tbody className='table-body'>
                        {this.renderBodyRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

DataTable.propTypes = {
    columns         : PropTypes.array,
    data_source     : MobxPropTypes.arrayOrObservableArray,
    footer          : PropTypes.object,
    has_fixed_header: PropTypes.bool,
};



export default DataTable;
