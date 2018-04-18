import React from 'react';
// import DataTable from '../../components/elements/data_table.jsx';

class Portfolio extends React.PureComponent  {
    constructor(props) {
        super(props);

        this.state = {
            columns      : '',
            data_source  : [],
            is_loaded_all: false,
        };
    }

    test() {
        console.log('test');
        this.setState({
            columns: 'test',
        });
    }

    render() {
        return (
            // <DataTable
            //     {...this.props}
            // />
            <h1 onClick={this.test}>Portfolio Here</h1>
        );
    }
};

export default Portfolio;