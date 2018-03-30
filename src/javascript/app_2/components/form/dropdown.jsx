import React from 'react';

class Dropdown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleVisibility   = this.handleVisibility.bind(this);
        this.handleSelect       = this.handleSelect.bind(this);
        this.setWrapperRef      = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            is_list_visible: false,
        };
    }

    isOneLevel() {
        return Array.isArray(this.props.list);
    }

    getDisplayText(list, value) {
        const findInArray = (arr_list) => (arr_list.find(item => item.value === value) || {}).text;
        let text = '';
        if (this.isOneLevel(list)) {
            text = findInArray(list);
        } else {
            Object.keys(list).some(key => {
                text = findInArray(list[key]);
                return text;
            });
        }
        return text;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect(item) {
        if (item.value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleVisibility();
    }

    setWrapperRef(node) {
        this.wrapper_ref = node;
    }

    scrollToggle(state) {
        this.is_open = state;
        // Used to disable y-scroll on body - disabled in this component for now
        // document.body.classList.toggle('no-scroll', this.is_open);
    }

    handleClickOutside(event) {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_list_visible) {
            this.setState({ is_list_visible: false });
            this.scrollToggle(this.state.is_list_visible);
        }
    }

    handleVisibility() {
        this.setState({ is_list_visible: !this.state.is_list_visible });
        this.scrollToggle(!this.state.is_list_visible);
    }

    render() {
        return (
            <div
                ref={this.setWrapperRef}
                className={`dropdown-container ${this.props.className ? this.props.className : ''} ${this.state.is_list_visible ? 'show' : ''}`}
            >
                <div
                    className={`dropdown-display ${this.state.is_list_visible ? 'clicked': ''}`}
                    onClick={this.handleVisibility}
                    onBlur={this.handleVisibility}
                >
                    <span name={this.props.name} value={this.props.value}>
                        {this.getDisplayText(this.props.list, this.props.value)}
                    </span>
                </div>
                <span className='select-arrow' />
                <div className='dropdown-list'>
                    <div className='list-container'>
                        { this.isOneLevel(this.props.list) ?
                            <Items
                                items={this.props.list}
                                name={this.props.name}
                                value={this.props.value}
                                handleSelect={this.handleSelect}
                                type={this.props.type || undefined}
                            /> :
                            Object.keys(this.props.list).map(key => (
                                <React.Fragment key={key}>
                                    <div className='list-label'><span>{key}</span></div>
                                    <Items
                                        items={this.props.list[key]}
                                        name={this.props.name}
                                        value={this.props.value}
                                        handleSelect={this.handleSelect}
                                    />
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const Items = ({
    items,
    name,
    value,
    handleSelect,
    type,
}) => (
    items.map((item, idx) => (
        <React.Fragment key={idx}>
            <div
                className={`list-item ${ value === item.value ? 'selected' : ''}`}
                key={idx}
                name={name}
                value={item.value}
                data-end={type==='date' && item.end ? item.end : undefined}
                onClick={handleSelect.bind(null, item)}
            >
                <span>{item.text}</span>
            </div>
        </React.Fragment>
    ))
);

export default Dropdown;
