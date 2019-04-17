import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import DropdownTooltip     from 'App/Components/Form/DropDown/dropdown-tooltip.jsx';
import { getCurrencyName } from '_common/base/currency_base';

class Item extends React.PureComponent {
    state = {
        should_show_tooltip: false,
    }

    onMouseEnter = () => {
        this.setState({
            should_show_tooltip: true,
        });
    }

    onMouseLeave = () => {
        this.setState({
            should_show_tooltip: false,
        });
    }

    render() {
        const {
            handleSelect,
            has_symbol,
            item,
            name,
            value,
        } = this.props;
        
        return (
            <div
                className={classNames(
                    'list__item',
                    { 'list__item--selected': value === item.value }
                )}
                name={name}
                value={item.value}
                onClick={handleSelect.bind(null, item)}
            >
                {!!has_symbol && item.has_tooltip &&
                    <React.Fragment>
                        <i className='list__item-tooltip'>
                            <span
                                className={`symbols list__item-tooltip-symbols symbols--${(item.text || '').toLowerCase()}`}
                                onMouseEnter={this.onMouseEnter}
                                onMouseLeave={this.onMouseLeave}
                            />
                        </i>
                        <DropdownTooltip
                            alignment='left'
                            className='list__item-tooltip'
                            message={getCurrencyName(item.value)}
                            should_show_tooltip={this.state.should_show_tooltip}
                        />
                    </React.Fragment>
                }

                {!!has_symbol && !item.has_tooltip &&
                    <span className={`list__item-text symbols symbols--${(item.text || '').toLowerCase()}`} />
                }

                {!has_symbol &&
                    <span className='list__item-text'>{item.text}</span>
                }
            </div>
        );
    }
}

Item.propTypes = {
    handleSelect: PropTypes.func,
    has_symbol  : PropTypes.bool,
    name        : PropTypes.string,
    value       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Item;
