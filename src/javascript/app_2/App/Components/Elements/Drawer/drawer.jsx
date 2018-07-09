import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import { DrawerHeader } from './drawer_header.jsx';
import { connect }      from '../../../../Stores/connect';


class Drawer extends React.Component {
    state = {
        is_this_drawer_on: false,
    };

    setRef = (node) => {
        this.ref = node;
    };

    scrollToggle(state) {
        this.is_open = state;
        document.body.classList.toggle('no-scroll', this.is_open);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.alignment==='left') {
            this.setState({is_this_drawer_on: nextProps.is_main_drawer_on});
        } else if (this.props.alignment==='right'){
            this.setState({is_this_drawer_on: nextProps.is_notifications_drawer_on});
        }
    }

    hide = () => {
        this.scrollToggle(false);
        this.props.hideDrawers();
    };

    handleClickOutside = (event) => {
        if (this.state.is_this_drawer_on) {
            if (this.ref && !this.ref.contains(event.target)) {
                this.hide();
            }
        }
    };

    render() {
        const { is_this_drawer_on } = this.state;
        const { alignment, closeBtn, children } = this.props;

        const visibility = {
            visibility: `${!is_this_drawer_on ? 'hidden' : 'visible'}`,
        };
        const drawer_bg_class = classNames('drawer-bg', {
            'show': is_this_drawer_on,
        });
        const drawer_class = classNames('drawer', {
            'visible': is_this_drawer_on,
        }, alignment);

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
                            alignment={alignment}
                            closeBtn={closeBtn}
                        />
                        {children}
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
    closeBtn                  : PropTypes.func,
    footer                    : PropTypes.func,
    hideDrawers               : PropTypes.func,
    icon_class                : PropTypes.string,
    icon_link                 : PropTypes.string,
    is_main_drawer_on         : PropTypes.bool,
    is_notifications_drawer_on: PropTypes.bool,
};

const drawer_component = connect(
    ({ ui }) => ({
        is_main_drawer_on         : ui.is_main_drawer_on,
        is_notifications_drawer_on: ui.is_notifications_drawer_on,
        hideDrawers               : ui.hideDrawers,
    })
)(Drawer);

export { drawer_component as Drawer };
