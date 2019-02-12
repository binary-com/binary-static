import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import Button                    from '../button.jsx';

import { IconMinus, IconPlus } from "../../../../Assets/Common";

const IncrementButtons = ({
                              max_is_disabled,
                              incrementValue,
                              min_is_disabled,
                              decrementValue,
               }) => {
    return (
        <React.Fragment>
            <Button
                className={'input-wrapper__button input-wrapper__button--increment'}
                is_disabled={max_is_disabled}
                onClick={incrementValue}
                tabIndex='-1'
            >
                <IconPlus className={'input-wrapper__icon input-wrapper__icon--plus' } is_disabled={max_is_disabled} />
            </Button>
            <Button
                className={'input-wrapper__button input-wrapper__button--decrement'}
                is_disabled={min_is_disabled}
                onClick={decrementValue}
                tabIndex='-1'
            >
                <IconMinus className={'input-wrapper__icon input-wrapper__icon--minus'} is_disabled={min_is_disabled} />
            </Button>
        </React.Fragment>
    );
};

IncrementButtons.propTypes = {
    max_is_disabled: PropTypes.bool,
    incrementValue : PropTypes.func,
    min_is_disabled: PropTypes.bool,
    decrementValue : PropTypes.func,
};

export default observer(IncrementButtons);
