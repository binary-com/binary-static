import React                     from 'react';
import CardList                  from '../Components/card_list.jsx';
import { formatPortfolioData }   from '../Helpers/process_data';
import DataTable                 from '../../../App/Components/Elements/data_table.jsx';
import NoticeMessage             from '../../../App/Components/Elements/notice_message.jsx';
import { contract_type_display } from '../../../Constants/contract';
import { WS }                    from '../../../Services';
import ClientBase                from '../../../../_common/base/client_base';
import { formatMoney }           from '../../../../_common/base/currency_base';
import { localize }              from '../../../../_common/localize';
import { getPropertyValue }      from '../../../../_common/utility';
import Loading                   from '../../../../../templates/_common/components/loading.jsx';
import { connect }                    from '../../../Stores/connect';
import { getTableColumnsTemplate }    from '../Constants/data_table_constants';

class Portfolio extends React.Component  {
    state = {
        // TODO: get currency from some common store
        currency   : ClientBase.get('currency').toLowerCase(),
    };

    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            data,
            is_mobile,
            is_loading,
            error,
        } = this.props;

        if (error) {
            return <p>{error}</p>;
        }

        return (
            // TODO: remove styled elements
            <div className='portfolio'>
            <React.Fragment>
                {
                    is_mobile ?
                        <CardList data={data} currency={this.state.currency} />
                        :
                        <DataTable
                            columns={getTableColumnsTemplate(this.state.currency)}
                            data_source={data}
                            footer={data.length > 0 ? footer : undefined}
                            has_fixed_header
                        />
                }
                {
                    is_loading &&
                    <Loading />
                }
                {!is_loading && data.length === 0 && <NoticeMessage>{localize('No open positions.')}</NoticeMessage>}
            </React.Fragment>
            </div>
        );
    }
}

export default connect(
    ({modules, ui}) => ({
        data                   : modules.portfolio.data,
        footer                 : modules.portfolio.footer,
        is_loading             : modules.portfolio.is_loading,
        error                  : modules.portfolio.error,
        onMount                : modules.portfolio.onMount,
        onUnmount              : modules.portfolio.onUnmount,
        is_mobile              : ui.is_mobile,
    })
)(Portfolio);
