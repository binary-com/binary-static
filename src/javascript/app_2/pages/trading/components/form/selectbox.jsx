import React from 'react';

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            listVisible: false,
            selected   : this.props.selected,
            value      : this.props.value,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect(item, event) {
        if (item.value !== this.state.value) {
            this.setState({ selected: item.name, value: item.value });
            this.props.on_change(event);
        }
        this.handleVisibility();
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            if (this.state.listVisible) {
                this.setState({ listVisible: false });
            }
        }
    }

    handleVisibility() {
        if (!this.state.listVisible) {
            this.setState({ listVisible: true });
        }
        else {
            this.setState({ listVisible: false });
        }
    }

    render() {
        return (
          <div ref={this.setWrapperRef} className={`dropdown-container ${this.state.listVisible ? 'show' : ''}`}>
              <div className={`dropdown-display ${this.state.listVisible ? 'clicked': ''}`}
                   onClick={this.handleVisibility} onBlur={this.handleVisibility}>
                  <span name={this.props.name}
                        value={this.state.value}>{this.state.selected}</span>
              </div>
              <span className='select-arrow'></span>
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
                  <div className='list-item'><span className='item-disabled'>No items</span></div>
                  }
                  </div>
              </div>
          </div>
        );
    }
};

export default Dropdown;
