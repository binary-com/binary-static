import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { CSSTransition }              from 'react-transition-group';
import { Scrollbars }                 from 'tt-react-custom-scrollbars';
import { localize }                   from '_common/localize';
import { IconMinimize }               from 'Assets/Common';
import EmptyPortfolioMessage          from 'Modules/Portfolio/Components/empty-portfolio-message.jsx';
import { connect }                    from 'Stores/connect';
import PositionsDrawerCard            from './positions-drawer-card.jsx';

class PositionsDrawer extends React.Component {
    componentDidMount()    {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const {
            active_positions,
            error,
            currency,
            is_empty,
            is_positions_drawer_on,
            onClickSell,
            toggleDrawer,
            server_time,
        } = this.props;

        let body_content;

        if (error) {
            body_content = <p>{error}</p>;
        } else if (is_empty) {
            body_content = <EmptyPortfolioMessage />;
        } else {
            // Show only 3 most recent open contracts
            body_content = active_positions.slice(0, 3).map((portfolio_position) => (
                <CSSTransition
                    key={portfolio_position.id}
                    in={!!(portfolio_position.underlying_code)}
                    timeout={250}
                    classNames={{
                        enter    : 'positions-drawer-card__wrapper--enter',
                        enterDone: 'positions-drawer-card__wrapper--enter-done',
                        exit     : 'positions-drawer-card__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <PositionsDrawerCard
                        onClickSell={onClickSell}
                        server_time={server_time}
                        key={portfolio_position.id}
                        currency={currency}
                        {...portfolio_position}
                    />
                </CSSTransition>
            ));
        }

        return (
            <div className={classNames('positions-drawer', { 'positions-drawer--open': is_positions_drawer_on })}>
                <div className='positions-drawer__header'>
                    <span className='positions-drawer__title'>{localize('Positions')}</span>
                    <div
                        className='positions-drawer__icon-close'
                        onClick={toggleDrawer}
                    >
                        <IconMinimize />
                    </div>
                </div>
                <div className='positions-drawer__body'>
                    <Scrollbars
                        style={{ width: '100%', height: '100%' }}
                        autoHide
                    >
                        {body_content}
                    </Scrollbars>
                </div>
                <div className='positions-drawer__footer'>
                    {/* TODO: Toggle to popup the Reports Dialog once Dialog is available */}
                    <a className='btn btn__alternate' href='javascript:;'>
                        <span>{localize('Go to Reports')}</span>
                    </a>
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
    onClickSell           : PropTypes.func,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
    server_time           : PropTypes.object,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ common, modules, client, ui }) => ({
        active_positions      : modules.portfolio.active_positions,
        is_loading            : modules.portfolio.is_loading,
        error                 : modules.portfolio.error,
        is_empty              : modules.portfolio.is_empty,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        onClickSell           : modules.portfolio.onClickSell,
        onMount               : modules.portfolio.onMount,
        onUnmount             : modules.portfolio.onUnmount,
        currency              : client.currency,
        toggleDrawer          : ui.togglePositionsDrawer,
        server_time           : common.server_time,
    })
)(PositionsDrawer);
