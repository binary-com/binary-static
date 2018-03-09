import React from 'react';
import moment from 'moment';

const TogglePortfolioDrawer = ({...props}) => (
    <a href='javascript:;'
       className={`${props.isPortfolioDrawerOn ? 'ic-portfolio-active' : 'ic-portfolio' }`}
       onClick={props.togglePortfolioDrawer}
    />
);

class PortfolioDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.state = {
            open : true,
            width: window.innerWidth,
        };
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleVisibility() {
        this.setState({ open: !this.state.open });
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
        const time_left = parseInt(moment.unix(epoch) - window.time.unix());
        return time_left;
    };

    render() {
        const { width } = this.state;
        const isMobile  = width <= 1024;
        const header = (
            isMobile ?
                <div
                    className='portfolio-drawer-header'
                    onClick={this.handleVisibility}
                >
                    <span className='ic-portfolio' />
                    <p>Portfolio</p>
                    <span className={`ic-close ${this.state.open ? 'open': '' }`} />
                </div>
                :
                <div className='portfolio-drawer-header'>
                    <span className='ic-portfolio' />
                    <p>Portfolio Quick Menu</p>
                    <a href='javascript:;'
                       className='ic-close'
                       onClick={this.props.onClick}
                    />
                </div>
        );

        return (
            <div className='portfolio-drawer'>
                { header }
                <div className={`portfolio-list ${this.state.open ? 'show': '' }`}>
                    {
                        this.props.portfolios.map((portfolio, idx) => (
                            <div key={idx} className='portfolio'>
                                <span className='ic-portfolio' />
                                <div className='asset'>
                                    <span className='symbol'>{portfolio.symbol}</span>
                                    <span className={`indicative-${this.getIndicative(portfolio.buy_price).value > 0 ? 'positive' : 'negative'}`}>
                                        {this.getIndicative(portfolio.buy_price).display}
                                    </span>
                                    <span className='remaining-time'>{moment(this.getRemainingTime(portfolio.expiry_time)).format(isMobile ? 'HH:mm' : 'HH:mm:ss')}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

module.exports = {
    PortfolioDrawer,
    TogglePortfolioDrawer,
};
