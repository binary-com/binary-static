import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';

const MarkerSpot = ({
    // icon,
    value,
}) => (
    <div>{value}</div>
);

MarkerSpot.propTypes = {
    icon : PropTypes.object,
    value: PropTypes.string,
};
export default observer(MarkerSpot);
