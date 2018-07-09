import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.Component {
    renderRow(transaction, id) {
        if (!transaction) return null;
        const defaultRenderCell = (data, data_index) => <td className={data_index} key={data_index}>{data}</td>;

        return (
            <tr className='table-row' key={id}>
                {this.props.columns.map(({ data_index, renderCell }) => {
                    const data = transaction[data_index] || '';
                    return (renderCell || defaultRenderCell)(data, data_index, transaction);
                })}
            </tr>
        );
    }

    renderBodyRows() {
        return this.props.data_source
            .map((transaction, id) => this.renderRow(transaction, id));
    }

    renderHeaders() {
        return this.props.columns.map(col => <th className={col.data_index} key={col.data_index}>{col.title}</th>);
    }

    renderTableClone() {
        /*
            cloned table with one row for fixed header
            inspired by
            https://stackoverflow.com/questions/4709390
        */
        return (
            <table className={classNames('table', 'table-clone', { 'table--full-width': this.props.is_full_width })}>
                <thead className='table-head'>
                    <tr className='table-row'>
                        {this.renderHeaders()}
                    </tr>
                </thead>

                <tbody className='table-body'>
                    {this.renderRow(this.props.data_source[0], 0)}
                </tbody>
            </table>
        );
    }

    render() {
        const table_class = classNames('table', {
            'table--full-width'  : this.props.is_full_width,
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
                            {this.renderRow(this.props.footer, 0)}
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
    is_full_width   : PropTypes.bool,
};



export default DataTable;
