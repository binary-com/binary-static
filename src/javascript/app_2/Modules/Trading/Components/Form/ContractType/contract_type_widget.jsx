import PropTypes             from 'prop-types';
import React                 from 'react';
import { IconTradeCategory } from 'Assets/Trading/Categories';
import ContractTypeDialog    from './contract_type_dialog.jsx';
import ContractTypeList      from './contract_type_list.jsx';
import TradeTypeInfoDialog   from '../TradeTypeInfo/trade_type_info_dialog.jsx';
import TradeTypeInfoItem     from '../TradeTypeInfo/trade_type_info_item.jsx';

class ContractTypeWidget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_dialog_open     : false,
            is_info_dialog_open: false,
            item               : {},
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSelect = (item, e) => {
        if (item.value !== this.props.value && e.target.id !== 'info-icon') {
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleVisibility();
    };

    onSubmitButtonClick = (item) => {
        if (item.value !== this.props.value) {
            this.props.onChange({ target: { name: this.props.name, value: item.value } });
        }
        this.handleInfoVisibility();
    };

    handleInfoClick = (item) => {
        this.setState({ item });
        this.handleInfoVisibility();
        this.handleVisibility();
    };

    handleNavigationClick = (item) => {
        this.setState({ item });
    };

    handleNextClick = (navigationList) => {
        const navigationLength = navigationList.length;
        const item = this.state.item;
        const currentIndex = navigationList.findIndex((list_item) => list_item.value === item.value);
        const nextIndex = currentIndex + 1;
        if (nextIndex < navigationLength) {
            this.handleNavigationClick(navigationList[nextIndex]);
        } else {
            this.handleNavigationClick(navigationList[0]);
        }
    };

    handlePrevClick = (navigationList) => {
        const navigationLength = navigationList.length;
        const item = this.state.item;
        const currentIndex = navigationList.findIndex((list_item) => list_item.value === item.value);
        const prevIndex = currentIndex - 1;
        if (prevIndex > -1) {
            this.handleNavigationClick(navigationList[prevIndex]);
        } else {
            this.handleNavigationClick(navigationList[navigationLength - 1]);
        }
    };

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_dialog_open) {
            this.setState({ is_dialog_open: false });
        } else if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_info_dialog_open) {
            this.setState({ is_info_dialog_open: false, is_dialog_open: true });
        }
    };

    handleInfoVisibility = () => {
        this.setState((state) => ({
            is_info_dialog_open: !state.is_info_dialog_open,
        }));
    };

    handleVisibility = () => {
        this.setState({ is_dialog_open: !this.state.is_dialog_open });
    };

    onWidgetClick = () => {
        this.setState((state) => ({ is_dialog_open: !state.is_dialog_open, is_info_dialog_open: false }));
    };

    onBackButtonClick = () => {
        this.setState((state) => ({ is_dialog_open: !state.is_dialog_open, is_info_dialog_open: false }));
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
    };

    getNavigationList = () => {
        const navigationList = [];
        const list = this.props.list;
        /* eslint-disable */
        Object.keys(list).map(key => {
            !['In/Out', 'Asians'].includes(key) && list[key].map(contract => {
                (contract.value !== 'rise_fall_equal') && navigationList.push(contract);
            });
        });
        /* eslint-disable */
        return navigationList;
    };

    render() {
        const container_classes = this.getStyles();

        return (
            <div
                ref={this.setWrapperRef}
                className={container_classes.join(' ')}
                tabIndex='0'
            >
                <div
                    className={`contracts-popup-display ${this.state.is_dialog_open ? 'clicked' : ''}`}
                    onClick={this.onWidgetClick}
                >
                    <IconTradeCategory category={this.props.value} />
                    <span name={this.props.name} value={this.props.value}>
                        {this.getDisplayText()}
                    </span>
                </div>

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
                        handleInfoClick={this.handleInfoClick}
                    />
                </ContractTypeDialog>
                <TradeTypeInfoDialog
                    is_mobile={this.props.is_mobile}
                    onClose={this.handleInfoClick}
                    open={this.state.is_info_dialog_open}
                    title={this.state.item.text}
                >
                    <TradeTypeInfoItem
                        handleNavigationClick={this.handleNavigationClick}
                        handleNextClick={this.handleNextClick}
                        handlePrevClick={this.handlePrevClick}
                        is_mobile={this.props.is_mobile}
                        item={this.state.item}
                        navigationList={this.getNavigationList()}
                        onBackButtonClick={this.onBackButtonClick}
                        onSubmitButtonClick={this.onSubmitButtonClick}
                    />
                </TradeTypeInfoDialog>
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
