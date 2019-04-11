import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React                 from 'react';
import { IconArrow }         from 'Assets/Common';
import { IconTradeCategory } from 'Assets/Trading/Categories';
import ContractTypeDialog    from './contract-type-dialog.jsx';
import ContractTypeList      from './contract-type-list.jsx';
import TradeTypeInfoDialog   from '../TradeTypeInfo/trade-type-info-dialog.jsx';
import TradeTypeInfoItem     from '../TradeTypeInfo/trade-type-info-item.jsx';

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
            this.setState({ is_info_dialog_open: false, is_dialog_open: false });
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
        return (
            <div
                ref={this.setWrapperRef}
                className='contract-type-widget dropdown--left'
                tabIndex='0'
            >
                <div
                    className={classNames('contract-type-widget__display', {
                        'contract-type-widget__display--clicked': this.state.is_dialog_open,
                    })}
                    onClick={this.onWidgetClick}
                >
                    <IconTradeCategory category={this.props.value} className='contract-type-widget__icon-wrapper' />
                    <span name={this.props.name} value={this.props.value}>
                        {this.getDisplayText()}
                    </span>
                    <IconArrow className='contract-type-widget__select-arrow contract-type-widget__select-arrow--left' />
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
                        is_equal={this.props.is_equal}
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
    is_equal           : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    list     : PropTypes.object,
    name     : PropTypes.string,
    onChange : PropTypes.func,
    value    : PropTypes.string,
};

export default ContractTypeWidget;
