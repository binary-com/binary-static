import React             from 'react';
import PropTypes         from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import classnames        from 'classnames';
import MenuItem          from './menu_item.jsx';

class MobileDropdown extends React.PureComponent {
    state = {
        is_open: false,
    };

    toggleOpen = () => {
        this.setState({
            is_open: !this.state.is_open,
        });
    }

    componentWillReceiveProps() {
        this.setState({
            is_open: false,
        });
    }

    render() {
        const { all_items, children } = this.props;
        const { is_open } = this.state;
        return (
            <div className={classnames('mobile-dropdown', { 'mobile-dropdown--open': is_open })}>
                <div className='mobile-dropdown__button' onClick={this.toggleOpen}>
                    <Switch>
                        {
                            all_items.map(({ title, description, path, img_src }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    render={() =>
                                        <MenuItem
                                            title={title}
                                            description={description}
                                            img_src={img_src}
                                        />
                                    }
                                />
                            ))
                        }
                    </Switch>
                    <span className='select-arrow' />
                </div>
                <div className='mobile-dropdown__menu'>{children}</div>
            </div>
        );
    }
}

MobileDropdown.propTypes = {
    all_items: PropTypes.arrayOf(
        PropTypes.shape({
            title      : PropTypes.string,
            description: PropTypes.string,
            img_src    : PropTypes.string,
            path       : PropTypes.string,
        })
    ),
    children: PropTypes.element,
};

export default MobileDropdown;
