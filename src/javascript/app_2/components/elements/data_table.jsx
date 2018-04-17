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

    fixHeaderInPlace(el_table_container) {
        if (!el_table_container) return;
        const el_table = el_table_container.querySelector('.table');
        const el_clone = el_table.cloneNode(true);
        el_clone.classList.add('table-clone');
        el_clone.style.top = offsetPageTop(el_table) + 'px';
        el_table_container.appendChild(el_clone);
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
        return this.props.columns.map(col => <th className={col.data_index} key={col.data_index}>{col.title}</th>);
    }

    render() {
        return (
            <div className='table-container' ref={this.fixHeaderInPlace}>
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
            </div>
        );
    }
}

DataTable.defaultProps = {
    chunk_size: 100,
};

export default DataTable;
