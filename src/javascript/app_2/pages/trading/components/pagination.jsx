import React from 'react';

class Pagination extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            current: 1
        };
    }

    handleChange = (newPage) => {
        const { pageSize } = this.props;

        this.setState(
            current: newPage
        );

        this.props.onChange(newPage, pageSize);
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
                {this.state.current}
                <li onClick={this.handleNext}><a>next</a></li>
            </ul>
        );
    }
}

Pagination.defaultProps = {
    total: 0,
    pageSize: 10
};

export default Pagination;
