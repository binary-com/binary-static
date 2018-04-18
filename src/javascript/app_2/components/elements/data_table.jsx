import React from 'react';

const offsetPageTop = (el) => {
    let offset = -el.clientTop;
    while (el) {
        offset += el.offsetTop + el.clientTop;
        el = el.offsetParent;
    }
    return offset;
};

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.Component {
    fixHeaderInPlace(el_table_container) {
        if (!el_table_container) return;
        const el_table = el_table_container.querySelector('.table');
        el_table.querySelector('.table-head').style.visibility = 'hidden';
        const el_table_clone = el_table_container.querySelector('.table-clone');
        el_table_clone.style.top = offsetPageTop(el_table) + 'px';
    }

    renderRow(transaction, id) {
        const defaultRenderCell = (data, data_index) => <td className={data_index} key={data_index}>{data}</td>;

        return (
            <tr className='table-row' key={id}>
                {this.props.columns.map(({ data_index, renderCell }) => (
                    (renderCell || defaultRenderCell)(transaction[data_index], data_index, transaction)
                ))}
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
        {/*
            cloned table with one row for fixed header
            inspired by
            https://stackoverflow.com/questions/4709390
        */}
        return (
            <table className='table table-clone'>
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
        return (
            <div className='table-container' ref={this.props.has_fixed_header && this.fixHeaderInPlace}>
                <div className='table-filter'>
                    two datepickers
                </div>
                <table className='table'>
                    <thead className='table-head'>
                        <tr className='table-row'>
                            {this.renderHeaders()}
                        </tr>
                    </thead>

                    <tbody className='table-body'>
                        {this.renderBodyRows()}
                    </tbody>
                </table>

                {this.props.has_fixed_header && this.renderTableClone()}
            </div>
        );
    }
}

export default DataTable;
