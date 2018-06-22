import React from 'react';
import PropTypes from 'prop-types';

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
        if (this.props.is_nativepicker) {
            return (
                <NativeSelect
                    name={this.props.name}
                    value={this.props.value}
                    list={this.props.list}
                    onChange={this.props.onChange}
                />
            );
        }
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
}) => (
    items.map((item, idx) => (
        <React.Fragment key={idx}>
            <div
                className={`list-item ${ value === item.value ? 'selected' : ''}`}
                key={idx}
                name={name}
                value={item.value}
                onClick={handleSelect.bind(null, item)}
            >
                <span>{item.text}</span>
            </div>
        </React.Fragment>
    ))
);

const NativeSelect = ({
    name,
    value,
    list,
    onChange,
}) => (
    <div className='select-wrapper'>
        <select name={name} value={value} onChange={onChange}>
            {Array.isArray(list) ?
              list.map((item, idx) => (
                  <option key={idx} value={item.value}>{item.text}</option>
              ))
            :
            Object.keys(list).map(key => (
                <React.Fragment key={key}>
                    <optgroup label={key}>
                        {list[key].map((item, idx) => (
                            <option key={idx} value={item.value}>{item.text}</option>
                        ))}
                    </optgroup>
                </React.Fragment>
            ))}
        </select>
    </div>
);

// ToDo: Refactor Drop-down.
// It's now too risky to refactor Dropdown for 'list' and 'value' prop types.
Dropdown.propTypes = {
    className      : PropTypes.string,
    is_nativepicker: PropTypes.bool,
    list           : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    name    : PropTypes.string,
    onChange: PropTypes.func,
    type    : PropTypes.string,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

};

// ToDo: Refactor NativeSelect
NativeSelect.propTypes = {
    list: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Dropdown;
