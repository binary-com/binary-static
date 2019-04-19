import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { withRouter }                 from 'react-router-dom';
import DataTable                      from 'App/Components/Elements/DataTable';
import { getContractPath }            from 'App/Components/Routes/helpers';
import { connect }                    from 'Stores/connect';
import EmptyStatementMessage          from '../Components/empty-statement-message.jsx';
import { getTableColumnsTemplate }    from '../Constants/data-table-constants';
import Loading                        from '../../../../../templates/_common/components/loading.jsx';

const PlaceholderComponent = (props) => (
    <React.Fragment>
        {props.is_empty && <EmptyStatementMessage has_selected_date={props.has_selected_date} />}
        {props.is_loading && <Loading />}
    </React.Fragment>
);

class Statement extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            data,
            is_empty,
            is_loading,
            error,
            handleScroll,
            has_selected_date,
        } = this.props;

        if (error) return <p>{error}</p>;

        const columns = getTableColumnsTemplate();

        return (
            <div className='statement__content'>
                <DataTable
                    className='statement'
                    data_source={data}
                    columns={columns}
                    onScroll={handleScroll}
                    getRowLink={(row_obj) => row_obj.id ? getContractPath(row_obj.id) : undefined}
                    is_empty={is_empty}
                >
                    <PlaceholderComponent
                        is_loading={is_loading}
                        has_selected_date={has_selected_date}
                        is_empty={is_empty}
                    />
                </DataTable>
            </div>
        );
    }
}

Statement.propTypes = {
    data             : MobxPropTypes.arrayOrObservableArray,
    error            : PropTypes.string,
    handleScroll     : PropTypes.func,
    has_selected_date: PropTypes.bool,
    history          : PropTypes.object,
    is_empty         : PropTypes.bool,
    is_loading       : PropTypes.bool,
    onMount          : PropTypes.func,
    onUnmount        : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        data             : modules.statement.data,
        error            : modules.statement.error,
        handleScroll     : modules.statement.handleScroll,
        has_selected_date: modules.statement.has_selected_date,
        is_empty         : modules.statement.is_empty,
        is_loading       : modules.statement.is_loading,
        onMount          : modules.statement.onMount,
        onUnmount        : modules.statement.onUnmount,
    })
)(withRouter(Statement));
