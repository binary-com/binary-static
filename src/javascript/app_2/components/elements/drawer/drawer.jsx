import React, { PureComponent } from 'react'
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import { DrawerHeader }   from './drawer_header';
import { connect }    from '../../../store/connect';


class Drawer extends React.PureComponent {
    state = {
        is_drawer_visible: this.props.is_main_drawer_on
    };

    setRef = (node) => {
        this.ref = node;
    }

    scrollToggle(state) {
        this.is_open = state;
        document.body.classList.toggle('no-scroll', this.is_open);
    }

    show = () => {
        this.scrollToggle(true);
        console.log('drawer:show')
        this.props.showMainDrawer();
        // this.props.toggleMainDrawer();
        // this.setState({is_drawer_visible: !this.state.is_drawer_visible})
    }

    hide = () => {
        this.scrollToggle(false);
        console.log('drawer:hide');
        console.log(this.props.is_main_drawer_on);
        this.props.hideMainDrawer();
        // this.props.toggleMainDrawer();
        // this.setState({is_drawer_visible: !this.state.is_drawer_visible})
    }

    handleClickOutside = (event) => {
        event.stopPropagation();
        if (this.ref && !this.ref.contains(event.target)) {
            this.hide();
        }
    }

    render() {
        const visibility = {
            visibility: `${!this.props.is_main_drawer_on ? 'hidden' : 'visible'}`,
        };
        const drawer_bg_class = classNames('drawer-bg', {
            'show': this.props.is_main_drawer_on,
        });
        const drawer_class = classNames('drawer', {
            'visible': this.props.is_main_drawer_on,
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
        is_main_drawer_on, toggleMainDrawer, showMainDrawer, hideMainDrawer,
    }}) => ({
        is_main_drawer_on, toggleMainDrawer, showMainDrawer, hideMainDrawer,
    })
)(Drawer);

export { drawer_component as Drawer };
