import PropTypes from 'prop-types';
import React     from 'react';
import Loading   from '../../../../../templates/_common/components/loading.jsx';

const PlaceholderComponent = (props) => {
    const EmptyMessageComponent = props.empty_message_component;
    return (
        <React.Fragment>
            {props.is_empty && <EmptyMessageComponent has_selected_date={props.has_selected_date} />}
            {props.is_loading && <Loading />}
        </React.Fragment>
    );
};

PlaceholderComponent.propTypes = {
    empty_message_component: PropTypes.func,
    has_selected_date      : PropTypes.bool,
};

export default PlaceholderComponent;
