import React                          from 'react';
import CardList                       from '../Components/card_list.jsx';
import { getTableColumnsTemplate }    from '../Constants/data_table_constants';
import DataTable                      from '../../../App/Components/Elements/data_table.jsx';
import NoticeMessage                  from '../../../App/Components/Elements/notice_message.jsx';
import { connect }                    from '../../../Stores/connect';
import ClientBase                     from '../../../../_common/base/client_base';
import { localize }                   from '../../../../_common/localize';
import Loading                        from '../../../../../templates/_common/components/loading.jsx';

class Portfolio extends React.Component {
    state = {
        // TODO: get currency from store, once it has been added
        currency   : ClientBase.get('currency').toLowerCase(),
    };

    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            data,
            footer,
            is_mobile,
            is_loading,
            error,
            totals,
            has_no_open_positions,
        } = this.props;

        if (error) {
            return <p>{error}</p>;
        }

        return (
            <div className='portfolio container'>
                {
                    is_mobile ?
                        <CardList data={data} currency={this.state.currency} />
                        :
                        <DataTable
                            columns={getTableColumnsTemplate(this.state.currency)}
                            data_source={data}
                            footer={data.length > 0 ? totals : undefined} // don't show footer if table is empty
                            has_fixed_header
                        />
                }
                {
                    is_loading &&
                    <Loading />
                }
                {has_no_open_positions && <NoticeMessage>{localize('No open positions.')}</NoticeMessage>}
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
        totals                 : modules.portfolio.totals,
        has_no_open_positions  : modules.portfolio.has_no_open_positions,
        onMount                : modules.portfolio.onMount,
        onUnmount              : modules.portfolio.onUnmount,
        is_mobile              : ui.is_mobile,
    })
)(Portfolio);
