import React, { PureComponent } from 'react';
import PropTypes      from 'prop-types';
import { connect }    from '../../../store/connect';
import { BinaryLink } from '../../../routes';

class DrawerItem extends PureComponent {

    onClick = () => {
        this.console.log('hello world');
    }

    render() {
        console.log(this.props);
        return (
            <div className='drawer-item' onClick={()=>this.onClick()}>
                <BinaryLink to={this.props.link_to}>
                    <span className={this.props.icon || undefined}>{this.props.text}</span>
                </BinaryLink>
            </div>
        );
    }
    // <a href={this.props.href || 'javascript:;' }>
    //     <span className={this.props.icon || undefined}>{this.props.text}</span>
    // </a>
}

DrawerItem.propTypes = {
    href: PropTypes.string,
    icon: PropTypes.string,
    text: PropTypes.string,
};

const drawer_component = connect(
    ({ ui }) => ({
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        togglePortfolioDrawer : ui.togglePortfolioDrawer,
    })
)(DrawerItem);

export { drawer_component as DrawerItem };
