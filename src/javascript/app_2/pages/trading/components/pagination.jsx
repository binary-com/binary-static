import React from 'react';

class Pagination extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            current: props.defaultCurrent
        };
    }

    calcNumOfPages = () => {
        const { total, pageSize } = this.props;
        return Math.ceil(total / pageSize);
    }

    handleNext = () => {
        if (this.state.current < this.calcNumOfPages()) {
            this.handleChange(this.state.current + 1);
        }
    }

    handlePrev = () => {
        if (this.state.current > 1) {
            this.handleChange(this.state.current - 1);
        }
    }

    render() {
        return (
            <ul>
                <li onClick={this.handlePrev}><a>prev</a></li>
                <li onClick={this.handleNext}><a>next</a></li>
            </ul>
        );
    }
}

Pagination.defaultProps = {
    total: 0,
    pageSize: 10,
    defaultCurrent: 1
};

export default Pagination;
