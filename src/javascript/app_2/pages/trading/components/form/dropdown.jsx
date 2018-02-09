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
            selected       : this.props.list.find(item => item.value === this.props.value).name || this.props.value,
            value          : this.props.value,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect(item) {
        if (item.value !== this.state.value) {
            this.setState({ selected: item.name, value: item.value });
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleVisibility();
    }

    setWrapperRef(node) {
        this.wrapper_ref = node;
    }

    handleClickOutside(event) {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_list_visible) {
            this.setState({ is_list_visible: false });
        }
    }

    handleVisibility() {
        this.setState({ is_list_visible: !this.state.is_list_visible });
    }

    render() {
        return (
            <div ref={this.setWrapperRef} className={`dropdown-container ${this.state.is_list_visible ? 'show' : ''}`}>
                <div
                    className={`dropdown-display ${this.state.is_list_visible ? 'clicked': ''}`}
                    onClick={this.handleVisibility}
                    onBlur={this.handleVisibility}
                >
                    <span name={this.props.name} value={this.state.value}>{this.state.selected}</span>
                </div>
                <span className='select-arrow' />
                <div className='dropdown-list'>
                    <div className='list-container'>
                    { this.props.list.length ?
                        this.props.list.map((item, idx) => (
                            <div
                                className={`list-item ${ this.state.value === item.value ? 'selected':''}`}
                                key={idx}
                                name={this.props.name}
                                value={item.value}
                                onClick={this.handleSelect.bind(null, item)}
                            >
                                <span>{item.name}</span>
                            </div>
                        ))
                    :
                        <div className='list-item'>
                            <span className='item-disabled'>No items</span>
                        </div>
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default Dropdown;
