import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SettingContentHeader } from '../components/setting_content_header.jsx';
import DataTable from '../../../components/elements/data_table.jsx';
import { connect } from '../../../store/connect';
import { localize } from '../../../../_common/localize';
import Loading from '../../../../../templates/_common/components/loading.jsx';

const columns = [
    {
        title     : localize('Date and Time'),
        data_index: 'time',
    },
    {
        title     : localize('Action'),
        data_index: 'action',
    },
    {
        title     : localize('Browser'),
        data_index: 'browser',
    },
    {
        title     : localize('IP Address'),
        data_index: 'ip_addr',
    },
    {
        title     : localize('Status'),
        data_index: 'success',
    },
];

class LoginHistory extends PureComponent {
    componentDidMount() {
        this.props.getData();
    }

    render() {
        const { title, content, data, is_loading } = this.props;
        // TODO: show loading on top of table when loading second time?
        return (
            <div className='settings__content_container settings__login_history'>
                <SettingContentHeader title={title} content={content}/>
                <DataTable data_source={data} columns={columns} />
                {is_loading && <Loading />}
            </div>
        );
    }
}

LoginHistory.propTypes = {
    content   : PropTypes.string,
    data      : PropTypes.array,
    getData   : PropTypes.func,
    is_loading: PropTypes.bool,
    title     : PropTypes.string,
};

export default connect(
    ({ pages: {settings: {login_history} } }) => ({
        data      : login_history.data,
        getData   : login_history.getData,
        is_loading: login_history.is_loading,
    })
)(LoginHistory);
