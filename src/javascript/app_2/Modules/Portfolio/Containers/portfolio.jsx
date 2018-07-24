import classnames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import CardList                       from '../Components/card_list.jsx';
import EmptyPortfolioMessage          from '../Components/empty_portfolio_message.jsx';
import { getTableColumnsTemplate }    from '../Constants/data_table_constants';
import DataTable                      from '../../../App/Components/Elements/data_table.jsx';
import { connect }                    from '../../../Stores/connect';
import Loading                        from '../../../../../templates/_common/components/loading.jsx';

class Portfolio extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

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
                        />
                }
            </div>
        );
    }
}

Portfolio.propTypes = {
    data      : MobxPropTypes.arrayOrObservableArray,
    totals    : PropTypes.object,
    error     : PropTypes.string,
    currency  : PropTypes.string,
    is_empty  : PropTypes.bool,
    is_loading: PropTypes.bool,
    is_mobile : PropTypes.bool,
    is_tablet : PropTypes.bool,
    onMount   : PropTypes.func,
    onUnmount : PropTypes.func,
};

export default connect(
    ({modules, client, ui}) => ({
        data      : modules.portfolio.data,
        is_loading: modules.portfolio.is_loading,
        error     : modules.portfolio.error,
        totals    : modules.portfolio.totals,
        is_empty  : modules.portfolio.is_empty,
        onMount   : modules.portfolio.onMount,
        onUnmount : modules.portfolio.onUnmount,
        currency  : client.currency,
        is_mobile : ui.is_mobile,
        is_tablet : ui.is_tablet,
    })
)(Portfolio);
