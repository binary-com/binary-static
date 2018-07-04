import React              from 'react';
import {observer, inject} from 'mobx-react';
import PropTypes          from 'prop-types';
import Filter             from './statement_filter.jsx';
import NoActivityMessage  from './no_activity_message.jsx';
import CardListMobile     from './card_list_mobile.jsx';
import CardListDesktop    from './card_list_desktop.jsx';
import Loading            from '../../../../../templates/_common/components/loading.jsx';
import moment     from 'moment';
import { connect }        from '../../../Stores/connect';

@inject(
    ({ modules, common }) => ({
        onMount             : modules.statement.onMount,
        onUnmount           : modules.statement.onUnmount,
        is_loading          : modules.statement.is_loading,
        no_activity_message : modules.statement.no_activity_message,
    })
)
@observer
export default class Statement extends React.Component {
    componentDidMount() { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const { no_activity_message, is_loading, statement, today } = this.props;

        return (
            <div className='statement'>

                <Filter />
                <Filter is_mobile />

                <div className='statement__content'>
                    <div className='desktop-only'>
                        <CardListDesktop />
                    </div>
                    <div className='mobile-only'>
                        <CardListMobile />
                    </div>
                    {is_loading &&
                        <Loading />
                    }
                    {no_activity_message &&
                        <NoActivityMessage />
                    }
                </div>
            </div>
        );
    }
}
