import classNames   from 'classnames';
import React        from 'react';
import PropTypes    from 'prop-types';
import { TabsItem } from './tabs_item.jsx';

class TabsWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sizes: {},
        };
        this.els = {};
    }

    componentDidMount() {
        this.getSizes();
        window.addEventListener('resize', this.getSizes);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getSizes);
    }

    getSizes = () => {
        const rootBounds = this.root.getBoundingClientRect();
        const sizes = {};
        Object.keys(this.els).forEach((key) => {
            const el = this.els[key];
            const bounds = el.getBoundingClientRect();

            const left = bounds.left - rootBounds.left;
            const right = rootBounds.right - bounds.right;

            sizes[key] = {left, right};
        });
        this.setState({sizes});
    }

    getUnderlineStyle = () => {
        if (this.props.active == null || Object.keys(this.state.sizes).length === 0) {
            return {left: '0', right: '100%'};
        }
        const size = this.state.sizes[this.props.active];
        return {
            left      : `${size.left}px`,
            right     : `${size.right}px`,
            transition: 'left 0.2s, right 0.25s',
        };
    }

    render() {
        return (
            <div
                className='tab-wrapper'
                ref={el => this.root = el}
            >
                <TabsItem
                    active={this.props.active}
                    onChange={this.props.onChange}
                    elements={this.els}
                >
                    {this.props.children}
                </TabsItem>
                <div
                    className='tab-underline'
                    style={this.getUnderlineStyle()}
                />
            </div>
        );
    }
}

class Tabs extends React.PureComponent {
    state = {
        active_tab_index: '1',
    };
    setActiveTab = (index) => {
        this.setState({active_tab_index: index});
    };
    render() {
        const TabContents = this.props.list[this.state.active_tab_index].content;
        const tab_container_class = classNames('tab-container', this.props.alignment);
        const tab_header_class = (icon_name) => classNames({
            icon: icon_name },
            icon_name,
        );
        return (
            <div className={tab_container_class}>
                <TabsWrapper
                    active={this.state.active_tab_index}
                    onChange={active => this.setActiveTab(active)}
                >
                    {
                        Object.keys(this.props.list).map(key => (
                            <React.Fragment key={key}>
                                <span
                                    className={tab_header_class(this.props.list[key].icon)}
                                    title={this.props.list[key].header}
                                >
                                    {this.props.list[key].header}
                                </span>
                            </React.Fragment>
                        ))
                    }
                </TabsWrapper>
                <TabContents />
            </div>
        );
    }
};

TabsWrapper.propTypes = {
    active      : PropTypes.string,
    children    : PropTypes.node,
    toggleDialog: PropTypes.func,
    onChange    : PropTypes.func,
};

Tabs.propTypes = {
    alignment: PropTypes.string,
    list     : PropTypes.shape({
        header: PropTypes.string,
        icon  : PropTypes.string,
    }),
};

export { TabsWrapper, Tabs };
