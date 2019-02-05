import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Scrollbars }                 from 'tt-react-custom-scrollbars';
import { localize }                   from '_common/localize';
import { IconMinus }                  from 'Assets/Common';
import EmptyPortfolioMessage          from 'Modules/Portfolio/Components/empty_portfolio_message.jsx';
import { connect }                    from 'Stores/connect';
import PositionsDrawerCard            from './positions_drawer_card.jsx';

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
            toggleDrawer,
        } = this.props;

        let body_content;

        if (error) {
            body_content = <p>{error}</p>;
        } else if (is_empty) {
            body_content = <EmptyPortfolioMessage />;
        } else {
            body_content = active_positions.map((portfolio_position) => (
                <PositionsDrawerCard
                    key={portfolio_position.id}
                    currency={currency}
                    {...portfolio_position}
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
                    <Scrollbars
                        style={{ width: '100%', height: 'calc(100vh - 175px)' }}
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
    ({ modules, client, ui }) => ({
        active_positions      : modules.portfolio.active_positions,
        is_loading            : modules.portfolio.is_loading,
        error                 : modules.portfolio.error,
        is_empty              : modules.portfolio.is_empty,
        onMount               : modules.portfolio.onMount,
        onUnmount             : modules.portfolio.onUnmount,
        currency              : client.currency,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        toggleDrawer          : ui.togglePositionsDrawer,
    })
)(PositionsDrawer);
