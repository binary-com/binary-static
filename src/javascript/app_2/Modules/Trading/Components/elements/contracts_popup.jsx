import React            from 'react';
import PropTypes        from 'prop-types';
import FullscreenDialog from './fullscreen_dialog.jsx';

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

    renderList() {
        return (
            Object.keys(this.props.list).map(key => (
                <React.Fragment key={key}>
                    <div className='list-group'>
                        <div className='list-label'><span>{key}</span></div>
                        <div className='list-items'>
                            <Contracts
                                contracts={this.props.list[key]}
                                name={this.props.name}
                                value={this.props.value}
                                handleSelect={this.handleSelect}
                            />
                        </div>
                    </div>
                </React.Fragment>
            ))
        );
    }

    renderPopupList() {
        return (
            <div className='contracts-popup-list'>
                <div className='list-container'>
                    {this.renderList()}
                </div>
            </div>
        );
    }

    renderModal() {
        return (
            <FullscreenDialog
                title='Select Trading Type'
                visible={this.state.is_list_visible}
                onClose={this.handleVisibility}
            >
                {this.renderList()}
            </FullscreenDialog>
        );
    }

    render() {
        const container_classes = ['contracts-popup-container'];
        if (this.props.className)       container_classes.push(this.props.className);
        if (this.state.is_list_visible) container_classes.push('show');

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
                className={container_classes.join(' ')}
                onClick={this.handleVisibility}
                onBlur={this.handleVisibility}
            >
                <div
                    className={`contracts-popup-display ${this.state.is_list_visible ? 'clicked': ''}`}
                >
                    <i className={`contract-icon ic-${this.props.value}--invert`} />
                    <span name={this.props.name} value={this.props.value}>
                        {getDisplayText(this.props.list, this.props.value)}
                    </span>
                </div>
                { !this.props.is_mobile_widget && <span className='select-arrow' /> }
                {
                    this.props.is_mobile_widget
                    ? this.renderModal()
                    : this.renderPopupList()
                }
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
            <i className={`contract-icon ic-${contract.value}${value === contract.value ? '' : '--invert'}`} />
            <span className='contract-title'>
                {contract.text}
            </span>
        </div>
    ))
);

ContractsPopUp.propTypes = {
    className       : PropTypes.string,
    is_mobile_widget: PropTypes.bool,
    list            : PropTypes.object,
    name            : PropTypes.string,
    onChange        : PropTypes.func,
    value           : PropTypes.string,
};

export default ContractsPopUp;
