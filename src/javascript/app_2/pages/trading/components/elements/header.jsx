import React from 'react';

class TradingHeader extends React.Component {
    constructor(props) {
        super(props);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            listVisible: false,
        };
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            if (this.state.listVisible) {
                this.setState({ listVisible: false });
            }
        }
    }

    handleVisibility() {
        if (!this.state.listVisible) {
            this.setState({ listVisible: true });
        }
        else {
            this.setState({ listVisible: false });
        }
    }

    render() {
        return (
            <div className='clock-header' ref={this.setClockRef}>
                <span className='field-info left'>{this.props.header}</span>
                <span className='field-info right'>{this.state.time}</span>
            </div>
        );
    }
};

class StaticHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
          <header id={this.props.id} className='shadow'>
              <div className='menu-items'>
                  <div className='menu-left'>
                      <div className='navbar-icons menu-toggle'>
                          <img src={it.url_for('/images/japan/version1/main_menu.svg')} alt='Menu' />
                      </div>
                      <div className='navbar-icons binary-logo'>
                          <img className='logo-img' src={it.url_for('/images/pages/binary-symbol-logo.svg')} alt='Binary.com' />
                      </div>
                      { this.props.items.length ?
                        <div className='menu-links'>
                            {this.props.items.map((item, idx) => (
                                <a key={idx} href={item.href || 'javascript:;'} >
                                    <span className={item.icon}>{item.text}</span>
                                </a>
                            ))}
                        </div>
                        :
                        undefined
                      }
                  </div>
                  <div className='navbar-icons notifications-toggle'>
                      <img src={it.url_for('/images/japan/version1/main_menu.svg')} alt='Alert' />
                  </div>
              </div>
          </header>
        );
    }
};

module.exports = {
    TradingHeader,
    StaticHeader,
};
