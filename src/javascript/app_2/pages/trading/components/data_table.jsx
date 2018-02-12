import React from 'react';

class Pagination extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.calcNumOfPages = this.calcNumOfPages.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleJumpUp = this.handleJumpUp.bind(this);
        this.handleJumpDown = this.handleJumpDown.bind(this);
        this.renderUpEllipsis = this.renderUpEllipsis.bind(this);
        this.renderDownEllipsis = this.renderDownEllipsis.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderItemRange = this.renderItemRange.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.state = {
            current: 1
        };
    }

    handleChange(newPage) {
        if (newPage === this.state.current) return;

        const { pageSize } = this.props;

        this.setState({
            current: newPage
        });

        this.props.onChange(newPage, pageSize);
    }

    calcNumOfPages() {
        const { total, pageSize } = this.props;
        return Math.ceil(total / pageSize);
    }

    handleNext() {
        if (this.state.current < this.calcNumOfPages()) {
            this.handleChange(this.state.current + 1);
        }
    }

    handlePrev() {
        if (this.state.current > 1) {
            this.handleChange(this.state.current - 1);
        }
    }

    handleJumpUp() {
        this.handleChange(Math.min(
            this.state.current + 5,
            this.calcNumOfPages()
        ));
    }

    handleJumpDown() {
        this.handleChange(Math.max(
            1,
            this.state.current - 5
        ));
    }

    renderUpEllipsis() {
        return (
            <li
                className='pagination-item pagination-ellipsis'
                key='ellipsis-up'
                onClick={this.handleJumpUp}
            >
                <a>...</a>
            </li>
        );
    }

    renderDownEllipsis() {
        return (
            <li
                className='pagination-item pagination-ellipsis'
                key='ellipsis-down'
                onClick={this.handleJumpDown}
            >
                <a>...</a>
            </li>
        );
    }

    renderItem(pageNum) {
        return (
            <li
                className={`pagination-item ${pageNum === this.state.current ? 'pagination-item-active' : ''}`}
                key={pageNum}
                onClick={() => {
                    this.handleChange(pageNum)
                }}
            >
                <a>{pageNum}</a>
            </li>
        );
    }

    renderItemRange(first, last) {
        const items = [];

        for (let pageNum = first; pageNum <= last; pageNum++) {
            items.push(this.renderItem(pageNum));
        }
        return items;
    }

    renderItems() {
        const numOfPages = this.calcNumOfPages();
        const { current } = this.state;

        if (numOfPages <= 9) {
            return this.renderItemRange(1, numOfPages);
        }
        else if (current <= 3) {
            return [
                ...this.renderItemRange(1, 5),
                this.renderUpEllipsis(),
                this.renderItem(numOfPages)
            ];
        }
        else if (current === 4) {
            return [
                ...this.renderItemRange(1, 6),
                this.renderUpEllipsis(),
                this.renderItem(numOfPages)
            ];
        }
        else if (current === numOfPages - 3) {
            return [
                this.renderItem(1),
                this.renderDownEllipsis(),
                ...this.renderItemRange(numOfPages - 5, numOfPages)
            ];
        }
        else if (numOfPages - current < 3) {
            return [
                this.renderItem(1),
                this.renderDownEllipsis(),
                ...this.renderItemRange(numOfPages - 4, numOfPages)
            ];
        }
        else {
            return [
                this.renderItem(1),
                this.renderDownEllipsis(),
                ...this.renderItemRange(current - 2, current + 2),
                this.renderUpEllipsis(),
                this.renderItem(numOfPages)
            ];
        }
    }

    render() {
        const { current } = this.state;
        return (
            <ul className='pagination'>
                <li
                    className={`pagination-prev ${current === 1 ? 'pagination-disabled' : ''}`}
                    onClick={this.handlePrev}
                >
                    <a>&lt;</a>
                </li>
                {this.renderItems()}
                <li
                    className={`pagination-next ${current === this.calcNumOfPages() ? 'pagination-disabled' : ''}`}
                    onClick={this.handleNext}
                >
                    <a>&gt;</a>
                </li>
            </ul>
        );
    }
}

Pagination.defaultProps = {
    total: 0,
    pageSize: 10,
    onChange: (page, pageSize) => {console.log(page, pageSize)}
};


class DataTable extends React.Component {
    constructor(props) {
        super(props);
        const { dataSource, pagination, pageSize } = props;

        this.handlePageChange = this.handlePageChange.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

        this.state = {
            displayData: pagination ? dataSource.slice(0, pageSize) : dataSource
        }
    }

    handlePageChange(page, pageSize) {
        const startId = (page - 1) * pageSize;
        const endId = startId + pageSize;

        this.setState({
            displayData: this.props.dataSource.slice(startId, endId)
        });
    }

    renderPagination() {
        return (
            <div className='table-pagination'>
                <Pagination
                    total={this.props.dataSource.length}
                    pageSize={this.props.pageSize}
                    onChange={this.handlePageChange}
                />
            </div>
        );
    }

    render() {
        const { dataSource, columns, pagination, pageSize } = this.props;
        const { displayData } = this.state;

        return (
            <div className='table-container'>
                <table className='table'>
                    <thead className='table-thead'>
                        <tr className='table-row'>
                            {columns.map(col => (
                                <th key={col.dataIndex}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className='table-tbody'>
                        {displayData.map((obj, id) => (
                            <tr className='table-row' key={id}>
                                {columns.map(({ dataIndex }) => (
                                    <td key={dataIndex}>{obj[dataIndex]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pagination && this.renderPagination()}
            </div>
        );
    }
}

DataTable.defaultProps = {
    pagination: true
};

export default DataTable;