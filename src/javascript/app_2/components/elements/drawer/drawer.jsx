import React, { Component } from 'react'
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import { DrawerHeader }   from './drawer_header';
import { connect }    from '../../../store/connect';


class Drawer extends React.Component {
    state = {
        is_this_drawer_on : false
    }

    scrollToggle(state) {
        this.is_open = state;
        document.body.classList.toggle('no-scroll', this.is_open);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.alignment=="left") {
            this.setState({is_this_drawer_on:nextProps.is_main_drawer_on})
        } else if(this.props.alignment=="right"){
            this.setState({is_this_drawer_on:nextProps.is_portfolio_drawer_on})
        }
    }

    hide = () => {
        this.scrollToggle(false);
        this.props.hideDrawers();
    }

    handleClickOutside = (event) => {
        event.stopPropagation();
        this.hide();
    }

    render() {
        let { is_this_drawer_on } = this.state;
        const visibility = {
            visibility: `${!is_this_drawer_on ? 'hidden' : 'visible'}`,
        };
        const drawer_bg_class = classNames('drawer-bg', {
            'show': is_this_drawer_on,
        });
        const drawer_class = classNames('drawer', {
            'visible': is_this_drawer_on,
        }, this.props.alignment);

        const DrawerFooter = this.props.footer;

        return (
            <aside className='drawer-container'>
                <div
                    className={drawer_bg_class}
                    style={visibility}
                    onClick={this.handleClickOutside}
                >
                    <div
                        ref={this.setRef}
                        className={drawer_class}
                        style={visibility}
                    >
                        <DrawerHeader
                            alignment={this.props.alignment}
                            closeBtn={this.props.closeBtn}
                        />
                        {this.props.children}
                        {DrawerFooter &&
                            <div className='drawer-footer'>
                                <DrawerFooter />
                            </div>
                        }
                    </div>
                </div>
            </aside>
        );
    }
}

Drawer.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    closeBtn  : PropTypes.func,
    footer    : PropTypes.func,
    icon_class: PropTypes.string,
    icon_link : PropTypes.string,
};

const drawer_component = connect(
    ({ ui: {
        is_main_drawer_on, hideDrawers, is_portfolio_drawer_on,
    }}) => ({
        is_main_drawer_on, hideDrawers, is_portfolio_drawer_on,
    })
)(Drawer);

export { drawer_component as Drawer };
