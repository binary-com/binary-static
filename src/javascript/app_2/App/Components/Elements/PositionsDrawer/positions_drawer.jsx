import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Scrollbars }                 from 'tt-react-custom-scrollbars';
import { localize }                   from '_common/localize';
import { IconMinus }                  from 'Assets/Common';
import EmptyPositionsMessage          from 'Modules/Positions/Components/empty_positions_message.jsx';
import { connect }                    from 'Stores/connect';
import PositionsDrawerCard            from './positions_drawer_card.jsx';

class PositionsDrawer extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const {
            active_positions,
            currency,
            error,
            is_empty,
            is_positions_drawer_on,
            toggleDrawer,
        } = this.props;

        let body_content;

        if (error) {
            body_content = <p>{error}</p>;
        } else if (is_empty) {
            body_content = <EmptyPositionsMessage />;
        } else {
            body_content = active_positions.map((position) => (
                <PositionsDrawerCard
                    key={position.id}
                    currency={currency}
                    {...position}
                />
            ));
        }

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
                    {/* style Prop's height below is calculated based on viewport height minus header height */}
                    <Scrollbars
                        style={{ width: '100%', height: 'calc(100vh - 35px)' }}
                        autoHide
                    >
                        {body_content}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}

PositionsDrawer.propTypes = {
    active_positions      : MobxPropTypes.arrayOrObservableArray,
    children              : PropTypes.any,
    currency              : PropTypes.string,
    error                 : PropTypes.string,
    is_empty              : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ client, modules, ui }) => ({
        currency              : client.currency,
        active_positions      : modules.positions.active_positions,
        error                 : modules.positions.error,
        is_empty              : modules.positions.is_empty,
        is_loading            : modules.positions.is_loading,
        onMount               : modules.positions.onMount,
        onUnmount             : modules.positions.onUnmount,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        toggleDrawer          : ui.togglePositionsDrawer,
    })
)(PositionsDrawer);
