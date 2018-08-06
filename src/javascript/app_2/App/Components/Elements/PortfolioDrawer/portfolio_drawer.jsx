import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from '../../../../Stores/connect';
import { localize }                   from '../../../../../_common/localize';
import PortfolioDrawerCard            from './portfolio_drawer_card.jsx';
import EmptyPortfolioMessage          from '../../../../Modules/Portfolio/Components/empty_portfolio_message.jsx';
import { IconClose }                  from '../../../../Assets/Common';

class PortfolioDrawer extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            data,
            error,
            currency,
            is_empty,
            is_portfolio_drawer_on,
            toggleDrawer,
        } = this.props;

        let body_content;

        if (error) {
            body_content = <p>{error}</p>;
        }
        else if (is_empty) {
            body_content = <EmptyPortfolioMessage />;
        }
        else {
            body_content = data.map((portfolio_position, id) => (
                <PortfolioDrawerCard
                    key={id}
                    currency={currency}
                    {...portfolio_position}
                />
            ));
        }

        return (
            <div className={classNames('portfolio-drawer', { 'portfolio-drawer--open': is_portfolio_drawer_on })}>
                <div className='portfolio-drawer__header'>
                    <span className='portfolio-drawer__icon-main ic-portfolio' />
                    <span className='portfolio-drawer__title'>{localize('Portfolio Quick Menu')}</span>
                    <div
                        className='portfolio-drawer__icon-close'
                        onClick={toggleDrawer}
                    >
                        <IconClose />
                    </div>
                </div>
                <div className='portfolio-drawer__body'>
                    {body_content}
                </div>
            </div>
        );
    }
};

PortfolioDrawer.propTypes = {
    children              : PropTypes.any,
    data                  : MobxPropTypes.arrayOrObservableArray,
    error                 : PropTypes.string,
    currency              : PropTypes.string,
    is_empty              : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_portfolio_drawer_on: PropTypes.bool,
    toggleDrawer          : PropTypes.func,
    onMount               : PropTypes.func,
    onUnmount             : PropTypes.func,
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
