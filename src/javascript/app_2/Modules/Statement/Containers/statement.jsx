import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import Filter                         from './statement_filter.jsx';
import NoActivityMessage              from '../Components/no_activity_message.jsx';
import ListLargeScreen                from '../Components/list_large_screen.jsx';
import ListSmallScreen                from '../Components/list_small_screen.jsx';
import { connect }                    from '../../../Stores/connect';
import Loading                        from '../../../../../templates/_common/components/loading.jsx';

class Statement extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            has_no_activity_message,
            has_selected_date,
            data,
            is_loading,
            is_mobile,
        } = this.props;

        return (
            <React.Fragment>
                <Filter />
                {
                    is_mobile ?
                        <ListSmallScreen data={data} />
                        :
                        <ListLargeScreen data={data} />
                }
                {
                    is_loading &&
                    <Loading />
                }
                {
                    has_no_activity_message &&
                    <NoActivityMessage has_selected_date={has_selected_date} />
                }
            </React.Fragment>
        );
    }
}

Statement.propTypes = {
    has_no_activity_message: PropTypes.bool,
    has_selected_date      : PropTypes.bool,
    data                   : MobxPropTypes.arrayOrObservableArray,
    is_loading             : PropTypes.bool,
    is_mobile              : PropTypes.bool,
    onMount                : PropTypes.func,
    onUnmount              : PropTypes.func,
};

export default connect(
    ({modules, ui}) => ({
        has_no_activity_message: modules.statement.has_no_activity_message,
        has_selected_date      : modules.statement.has_selected_date,
        data                   : modules.statement.data,
        is_loading             : modules.statement.is_loading,
        onMount                : modules.statement.onMount,
        onUnmount              : modules.statement.onUnmount,
        is_mobile              : ui.is_mobile,
    })
)(Statement);
