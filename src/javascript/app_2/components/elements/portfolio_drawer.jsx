import moment       from 'moment';
import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from '../../../_common/localize';

class PortfolioDrawer extends React.PureComponent {
    state = { is_open: true, width: window.innerWidth };

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleVisibility = () => {
        this.setState({ is_open: !this.state.is_open });
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    // TODO: returning correct indicative price & currency
    getIndicative = (v) => {
        const sign = v > 0 ? '+' : '-';
        return {
            value  : v,
            display: `${sign}$S${Math.abs(v)}`,
        };
    };

    // TODO: calculate remaining time and render
    getRemainingTime = (epoch) => {
        const time_left = parseInt(moment.unix(epoch) - this.props.server_time.unix());
        return time_left;
    };

    render() {
        const { width, is_open } = this.state;
        const is_mobile = width <= 1024;
        const header = (
            is_mobile ?
                <div
                    className='portfolio-drawer-header'
                    onClick={this.handleVisibility}
                >
                    <span className='ic-portfolio' />
                    <p>{localize('Portfolio')}</p>
                    <span className={`ic-close ${is_open ? 'open': '' }`} />
                </div>
                :
                <div className='portfolio-drawer-header'>
                    <span className='ic-portfolio' />
                    <p>{localize('Portfolio Quick Menu')}</p>
                    <a
                        href='javascript:;'
                        className='ic-close'
                        onClick={this.props.onClick}
                    />
                </div>
        );

        return (
            <div className='portfolio-drawer'>
                { header }
                <div className={`portfolio-list ${is_open ? 'show': '' }`}>
                    {
                        this.props.portfolios.map((portfolio, idx) => (
                            <div key={idx} className='portfolio'>
                                <span className='ic-portfolio' />
                                <div className='asset'>
                                    <span className='symbol'>{portfolio.symbol}</span>
                                    <span className={`indicative-${this.getIndicative(portfolio.buy_price).value > 0 ? 'positive' : 'negative'}`}>
                                        {this.getIndicative(portfolio.buy_price).display}
                                    </span>
                                    <span className='remaining-time'>{moment(this.getRemainingTime(portfolio.expiry_time)).format(is_mobile ? 'HH:mm' : 'HH:mm:ss')}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

PortfolioDrawer.propTypes = {
    alignment  : PropTypes.string,
    children   : PropTypes.object,
    onClick    : PropTypes.func,
    portfolios : PropTypes.array,
    server_time: PropTypes.object,
    subtitle   : PropTypes.number,
};

export default PortfolioDrawer;
