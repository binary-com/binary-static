import React from 'react';

function offsetPageTop(el) {
    let offset = -el.clientTop;
    while (el) {
        offset += el.offsetTop + el.clientTop;
        el = el.offsetParent;
    }
    return offset;
}

/* TODO:
      1. to implement sorting by column (ASC/DESC)
      2. to implement filtering per column
      3. to make pagination more customisable
*/
class DataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { chunks: 1 };
    }

    appendFixedHeader(el_table_container) {
        const el_table = el_table_container.querySelector('.table');
        const el_table_clone = el_table.cloneNode(true);
        // console.log(window.el = el_table_clone);
        const el_thead_clone = el_table_clone.querySelector('.table-thead');
        const el_tbody_clone = el_table_clone.querySelector('.table-tbody');

        el_table_clone.style.position = 'fixed';
        el_table_clone.style.top = offsetPageTop(el_table) + 'px';
        el_tbody_clone.style.visibility = 'hidden';
        el_table_container.appendChild(el_table_clone);
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
            .slice(0, this.state.chunks * this.props.chunk_size)
            .map((transaction, id) => this.renderRow(transaction, id));
    }

    renderHeaders() {
        return this.props.columns.map(col => <th key={col.data_index}>{col.title}</th>);
    }

    render() {
        return (
            <div className='table-container' ref={this.appendFixedHeader}>
                <table className='table'>
                    <thead className='table-thead'>
                        <tr className='table-row'>
                            {this.renderHeaders()}
                        </tr>
                    </thead>

                    <tbody className='table-tbody'>
                        {this.renderBodyRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

DataTable.defaultProps = {
    chunk_size: 10,
};

export default DataTable;
