import classnames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { withRouter }                 from 'react-router-dom';
import CardList                       from '../Components/card_list.jsx';
import EmptyPortfolioMessage          from '../Components/empty_portfolio_message.jsx';
import { getTableColumnsTemplate }    from '../Constants/data_table_constants';
import DataTable                      from '../../../App/Components/Elements/DataTable';
import { getContractPath }            from '../../../App/Components/Routes/helpers';
import { connect }                    from '../../../Stores/connect';
import Loading                        from '../../../../../templates/_common/components/loading.jsx';

class Portfolio extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    redirectToContract = (row_obj) => {
        this.props.history.push(getContractPath(row_obj.id));
    };

    render() {
        const {
            data,
            is_mobile,
            is_tablet,
            is_loading,
            error,
            totals,
            is_empty,
            currency,
        } = this.props;

        if (error) {
            return <p>{error}</p>;
        }

        if (is_loading) {
            return <Loading />;
        }

        if (is_empty) {
            return <EmptyPortfolioMessage />;
        }

        const should_show_cards = is_mobile || is_tablet;

        return (
            <div className={classnames('portfolio container', { 'portfolio--card-view': should_show_cards })}>
                {
                    should_show_cards ?
                        <CardList data={data} currency={currency} />
                        :
                        <DataTable
                            columns={getTableColumnsTemplate(currency)}
                            data_source={data}
                            footer={totals}
                            has_fixed_header
                            onRowClick={this.redirectToContract}
                        />
                }
            </div>
        );
    }
}

Portfolio.propTypes = {
    currency  : PropTypes.string,
    data      : MobxPropTypes.arrayOrObservableArray,
    error     : PropTypes.string,
    history   : PropTypes.object,
    is_empty  : PropTypes.bool,
    is_loading: PropTypes.bool,
    is_mobile : PropTypes.bool,
    is_tablet : PropTypes.bool,
    onMount   : PropTypes.func,
    onUnmount : PropTypes.func,
    totals    : PropTypes.object,
};

export default connect(
    ({modules, client, ui}) => ({
        currency  : client.currency,
        data      : modules.portfolio.data_with_remaining_time,
        error     : modules.portfolio.error,
        is_empty  : modules.portfolio.is_empty,
        is_loading: modules.portfolio.is_loading,
        totals    : modules.portfolio.totals,
        onMount   : modules.portfolio.onMount,
        onUnmount : modules.portfolio.onUnmount,
        is_mobile : ui.is_mobile,
        is_tablet : ui.is_tablet,
    })
)(withRouter(Portfolio));
