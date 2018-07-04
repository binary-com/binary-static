import React             from 'react';
import PropTypes         from 'prop-types';
import Filter            from './statement_filter.jsx';
import NoActivityMessage from '../Components/no_activity_message.jsx';
import CardListMobile    from './card_list_mobile.jsx';
import CardListDesktop   from './card_list_desktop.jsx';
import Loading           from '../../../../../templates/_common/components/loading.jsx';
import { connect }       from '../../../Stores/connect';

class Statement extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const { has_no_activity_message, is_loading } = this.props;

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
                    {has_no_activity_message &&
                        <NoActivityMessage />
                    }
                </div>
            </div>
        );
    }
}

Statement.propTypes = {
    is_loading             : PropTypes.bool,
    has_no_activity_message: PropTypes.bool,
    onMount                : PropTypes.func,
    onUnmount              : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        is_loading             : modules.statement.is_loading,
        has_no_activity_message: modules.statement.has_no_activity_message,
        onMount                : modules.statement.onMount,
        onUnmount              : modules.statement.onUnmount,
    })
)(Statement);
