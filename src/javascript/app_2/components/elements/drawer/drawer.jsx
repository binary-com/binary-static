import React, { PureComponent } from 'react'
import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import { DrawerHeader }   from './drawer_header';


class Drawer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_drawer_visible: false,
        };
        this.setRef = this.setRef.bind(this);
        this.show   = this.show.bind(this);
        this.hide   = this.hide.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    setRef(node) {
        this.ref = node;
    }

    scrollToggle(state) {
        this.is_open = state;
        document.body.classList.toggle('no-scroll', this.is_open);
    }

    show() {
        this.setState({ is_drawer_visible: true });
        this.scrollToggle(true);
    }

    hide() {
        this.setState({ is_drawer_visible: false });
        this.scrollToggle(false);
    }

    handleClickOutside(event) {
        event.stopPropagation();
        if (this.ref && !this.ref.contains(event.target)) {
            this.hide();
        }
    }

    render() {
        const visibility = {
            visibility: `${!this.state.is_drawer_visible ? 'hidden' : 'visible'}`,
        };
        const drawer_bg_class = classNames('drawer-bg', {
            'show': this.state.is_drawer_visible,
        });
        const drawer_class = classNames('drawer', {
            'visible': this.state.is_drawer_visible,
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

export default Drawer;
