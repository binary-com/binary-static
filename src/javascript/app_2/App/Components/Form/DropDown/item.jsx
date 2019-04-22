import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { TooltipWrapper }  from 'App/Components/Elements/Tooltip2';
import { getCurrencyName } from '_common/base/currency_base';

class Item extends React.PureComponent {
    state = {
        should_show_tooltip: false,
    }

    constructor(props) {
        super(props);
        this.item_reference = React.createRef();
        this.item_coordinates = {
            x     : 0,
            y     : 0,
            top   : 0,
            left  : 0,
            bottom: 0,
            right : 0,
            width : 0,
            height: 0,
        };
    }

    onMouseEnter = () => {
        this.setState({
            should_show_tooltip: true,
        });
        this.item_coordinates = this.item_reference.current.getBoundingClientRect();
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
                    <TooltipWrapper
                        alignment='left'
                        message={getCurrencyName(item.value)}
                    >
                        <span
                            className={`symbols list__item-symbol symbols--${(item.text || '').toLowerCase()}`}
                        />
                    </TooltipWrapper>
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
