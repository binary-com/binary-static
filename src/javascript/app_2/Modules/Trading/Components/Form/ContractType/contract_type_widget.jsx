import PropTypes          from 'prop-types';
import React              from 'react';
import ContractTypeDialog from './contract_type_dialog.jsx';
import ContractTypeList   from './contract_type_list.jsx';

class ContractTypeWidget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_dialog_open: false,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect = (item) => {
        if (item.value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleVisibility();
    };

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_dialog_open) {
            this.setState({ is_dialog_open: false });
        }
    };

    handleVisibility = () => {
        this.setState({ is_dialog_open: !this.state.is_dialog_open });
    };

    getDisplayText = () => {
        const { list, value } = this.props;
        const findInArray = (arr_list) => (arr_list.find(item => item.value === value) || {}).text;
        let text = '';
        if (list) {
            Object.keys(list).some(key => {
                text = findInArray(list[key]);
                return text;
            });
        }
        return text;
    };

    getStyles = () => {
        const container_classes = ['contracts-popup-container'];
        if (this.props.is_mobile) {
            container_classes.push('mobile-only');
        } else {
            container_classes.push('desktop-only');
        }
        if (this.state.is_dialog_open) container_classes.push('show');
        return container_classes;
    }

    render() {
        const container_classes = this.getStyles();

        return (
            <div
                ref={this.setWrapperRef}
                className={container_classes.join(' ')}
                onClick={this.handleVisibility}
                onBlur={this.handleVisibility}
            >
                <div
                    className={`contracts-popup-display ${this.state.is_dialog_open ? 'clicked': ''}`}
                >
                    <i className={`contract-icon ic-${this.props.value}--invert`} />
                    <span name={this.props.name} value={this.props.value}>
                        {this.getDisplayText()}
                    </span>
                </div>

                <span className='select-arrow' />

                <ContractTypeDialog
                    is_mobile={this.props.is_mobile}
                    open={this.state.is_dialog_open}
                    onClose={this.handleVisibility}
                >
                    <ContractTypeList
                        list={this.props.list}
                        name={this.props.name}
                        value={this.props.value}
                        handleSelect={this.handleSelect}
                    />
                </ContractTypeDialog>
            </div>
        );
    }
}

ContractTypeWidget.propTypes = {
    is_mobile: PropTypes.bool,
    list     : PropTypes.object,
    name     : PropTypes.string,
    onChange : PropTypes.func,
    value    : PropTypes.string,
};

export default ContractTypeWidget;
