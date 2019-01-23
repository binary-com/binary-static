import classNames        from 'classnames';
import { isArrayLike }   from 'mobx';
import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import SimpleBar         from 'simplebar-react';
import { IconArrow }     from 'Assets/Common';
import Items             from './items.jsx';
import NativeSelect      from './native_select.jsx';
import {
    getDisplayText,
    getItemFromValue,
    getValueFromIndex,
    getPrevIndex,
    getNextIndex,
}  from './helpers';

class Dropdown extends React.Component {
    state = {
        is_list_visible: false,
        curr_index     : getItemFromValue(this.props.list, this.props.value).number,
    }

    componentDidMount () {
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
    }

    onKeyPressed = (event) => {
        if (event.keyCode === 9) { // Tab is pressed
            if (this.state.is_list_visible) {
                this.handleVisibility();
            }
            return;
        }
        event.preventDefault();
        const index = getItemFromValue(this.props.list, this.props.value);
        const value = getValueFromIndex(this.props.list, this.state.curr_index);
        const handleToggle = () => {
            if (this.state.is_list_visible && this.props.value !== value) {
                this.props.onChange({ target: { name: this.props.name, value } });
            }
            this.handleVisibility();
        };
        switch (event.keyCode) {
            case 13: // Enter is pressed
            case 32: // Space is pressed
                handleToggle();
                break;
            case 38: // Up Arrow is pressed
                if (this.state.is_list_visible) {
                    const prev_index = getPrevIndex(this.state.curr_index, index.length);
                    this.setState({ curr_index: prev_index });
                }
                break;
            case 40: // Down Arrow is pressed
                if (this.state.is_list_visible) {
                    const next_index = getNextIndex(this.state.curr_index, index.length);
                    this.setState({ curr_index: next_index });
                }
                break;
            default:
        }

        // For char presses, we do a search for the item:
        if (event.key.length === 1) {
            const char = event.key.toLowerCase();
            const firstChars = this.props.list.map(x => x.text[0].toLowerCase());
            let idx;
            // Tapping the same character again jumps to the next match:
            if (this.state.curr_index) {
                idx = firstChars.indexOf(char, this.state.curr_index + 1);
            }
            if (idx === undefined || idx === -1) {
                idx = firstChars.indexOf(char);
            }
            if (idx >= 0) {
                this.setState({ curr_index: idx });
            }
        }
    }

    setWrapperRef = (node) => this.wrapper_ref = node;

    scrollToggle = (state) => this.is_open = state;

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_list_visible) {
            this.setState({ is_list_visible: false });
            this.scrollToggle(this.state.is_list_visible);
        }
    }

    handleVisibility = () => {
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
                className={classNames('dropdown-container', this.props.className, {
                    'dropdown-container--show': this.state.is_list_visible,
                })}
            >
                <div
                    className={classNames('dropdown__display', {
                        'dropdown__display--clicked': this.state.is_list_visible,
                    })}
                    onClick={this.handleVisibility}
                    tabIndex='0'
                    onKeyDown={this.onKeyPressed}
                >
                    <span name={this.props.name} value={this.props.value}>
                        {getDisplayText(this.props.list, this.props.value)}
                    </span>
                </div>
                <IconArrow className='select-arrow' />
                <CSSTransition
                    in={this.state.is_list_visible}
                    timeout={100}
                    classNames={{
                        enter    : 'dropdown__list--enter',
                        enterDone: 'dropdown__list--enter--done',
                        exit     : 'dropdown__list--exit',
                    }}
                    unmountOnExit
                >
                    <div className={classNames('dropdown__list', {
                        'dropdown__list--left': this.props.position === 'left',
                    })}
                    >
                        <div className='list'>
                            <SimpleBar style={{ 'height': '100%' }}>
                                {isArrayLike(this.props.list) ?
                                    <Items
                                        highlightedIdx={this.state.curr_index}
                                        items={this.props.list}
                                        name={this.props.name}
                                        value={this.props.value}
                                        handleSelect={this.handleSelect}
                                    /> :
                                    Object.keys(this.props.list).map(key => (
                                        <React.Fragment key={key}>
                                            <div className='list__label'><span>{key}</span></div>
                                            <Items
                                                highlightedIdx={this.state.curr_index}
                                                items={this.props.list[key]}
                                                name={this.props.name}
                                                value={this.props.value}
                                                handleSelect={this.handleSelect}
                                            />
                                        </React.Fragment>
                                    ))
                                }
                            </SimpleBar>
                        </div>
                    </div>
                </CSSTransition>
            </div>
        );
    }
}

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
    position: PropTypes.string,
    type    : PropTypes.string,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(Dropdown);
