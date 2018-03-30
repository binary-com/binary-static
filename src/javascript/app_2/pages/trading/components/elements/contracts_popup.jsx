import React from 'react';

class ContractsPopUp extends React.PureComponent {
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

    handleClickOutside(event) {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_list_visible) {
            this.setState({ is_list_visible: false });
        }
    }

    handleVisibility() {
        this.setState({ is_list_visible: !this.state.is_list_visible });
    }

    render() {
        const prefix_class = 'contracts-popup-container';
        const suffix_class = 'desktop-only';
        const getDisplayText = (list, value) => {
            const findInArray = (arr_list) => (arr_list.find(item => item.value === value) || {}).text;
            let text = '';
            if (!Array.isArray(list)) {
                Object.keys(list).some(key => {
                    text = findInArray(list[key]);
                    return text;
                });
            }
            return text;
        };
        return (
            <div
                ref={this.setWrapperRef}
                className={`${prefix_class} ${this.state.is_list_visible ? 'show ' : ''}${suffix_class}`}
            >
                <div
                    className={`contracts-popup-display ${this.state.is_list_visible ? 'clicked': ''}`}
                    onClick={this.handleVisibility}
                    onBlur={this.handleVisibility}
                >
                    <i className={`contract-icon ic-${this.props.value}`} />
                    <span name={this.props.name} value={this.props.value}>
                        {getDisplayText(this.props.list, this.props.value)}
                    </span>
                </div>
                <span className='select-arrow' />
                <div className='contracts-popup-list'>
                    <div className='list-container'>
                        {Object.keys(this.props.list).map(key => (
                            <React.Fragment key={key}>
                                <Contracts
                                    contracts={this.props.list[key]}
                                    name={this.props.name}
                                    value={this.props.value}
                                    handleSelect={this.handleSelect}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const Contracts = ({
    contracts,
    name,
    value,
    handleSelect,
}) => (
    contracts.map((contract, idx) => (
        <div
            key={idx}
            className={`list-item ${value === contract.value ? 'selected' : ''}`}
            name={name}
            value={contract.value}
            onClick={handleSelect.bind(null, contract)}
        >
            <span>
                <i className={`contract-icon ic-${contract.value}${value === contract.value ? '' : '--invert'}`} />
                {contract.text}
            </span>
        </div>
    ))
);

export default ContractsPopUp;
