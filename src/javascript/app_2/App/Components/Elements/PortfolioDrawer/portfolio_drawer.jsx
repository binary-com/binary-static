import classNames                     from 'classnames';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from '../../../../Stores/connect';
import { localize }                   from '../../../../../_common/localize';
import PortfolioDrawerCard            from './portfolio_drawer_card.jsx';

class PortfolioDrawer extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            data,
            error,
            currency,
            is_empty,
            is_loading,
            is_portfolio_drawer_on,
            onMount,
            onUnmount,
            toggleDrawer,
        } = this.props;

        return (
            <div className={classNames('portfolio-drawer', {
                'portfolio-drawer--open': is_portfolio_drawer_on,
            })}>
                <div className='portfolio-drawer__header'>
                    <span className='portfolio-drawer__icon-main ic-portfolio' />
                    <span className='portfolio-drawer__title'>{localize('Portfolio Quick Menu')}</span>
                    <a
                        href='javascript:;'
                        className='portfolio-drawer__icon-close'
                        onClick={toggleDrawer}
                    />
                </div>
                <div className='portfolio-drawer__body'>
                    {
                        data.map((portfolio_position, id) => (
                            <PortfolioDrawerCard
                                // type='ONETOUCH'
                                // symbol='Gold/USD'
                                // indicative={0.84}
                                // remaining_time='00:08:17'
                                // currency='USD'
                                // status='price-moved-up'
                                key={id}
                                {...portfolio_position}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
};

PortfolioDrawer.propTypes = {
    is_portfolio_drawer_on: PropTypes.bool,
    toggleDrawer          : PropTypes.func,
};

export default connect(
    ({ modules, client, ui }) => ({
        data                  : modules.portfolio.data_with_remaining_time,
        is_loading            : modules.portfolio.is_loading,
        error                 : modules.portfolio.error,
        is_empty              : modules.portfolio.is_empty,
        onMount               : modules.portfolio.onMount,
        onUnmount             : modules.portfolio.onUnmount,
        currency              : client.currency,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        toggleDrawer          : ui.togglePortfolioDrawer,
    })
)(PortfolioDrawer);
