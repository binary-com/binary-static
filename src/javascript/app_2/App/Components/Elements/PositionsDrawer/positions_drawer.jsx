import classNames                     from 'classnames';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Scrollbars }                 from 'tt-react-custom-scrollbars';
import { localize }                   from '_common/localize';
import { IconMinus }                  from 'Assets/Common';
import { connect }                    from 'Stores/connect';

class PositionsDrawer extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            is_positions_drawer_on,
            toggleDrawer,
        } = this.props;

        return (
            <div className={classNames('positions-drawer', { 'positions-drawer--open': is_positions_drawer_on })}>
                <div className='positions-drawer__header'>
                    <span className='positions-drawer__icon-main ic-positions' />
                    <span className='positions-drawer__title'>{localize('Positions')}</span>
                    <div
                        className='positions-drawer__icon-close'
                        onClick={toggleDrawer}
                    >
                        <IconMinus />
                    </div>
                </div>
                <div className='positions-drawer__body'>
                    <Scrollbars
                        style={{ width: '100%', height: 'calc(100vh - 35px)' }}
                        autoHide
                    >
                        No Running Contracts
                    </Scrollbars>
                </div>
            </div>
        );
    }
}

PositionsDrawer.propTypes = {
    children              : PropTypes.any,
    is_positions_drawer_on: PropTypes.bool,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        onMount               : modules.portfolio.onMount,
        onUnmount             : modules.portfolio.onUnmount,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        toggleDrawer          : ui.togglePositionsDrawer,
    })
)(PositionsDrawer);
