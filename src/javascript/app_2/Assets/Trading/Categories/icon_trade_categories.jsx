import PropTypes         from 'prop-types';
import React             from 'react';
import { IconTradeType } from '../Types/';

const IconTradeCategory = ({ category }) => {
    let IconCategory;
    if (category) {
        switch (category) {
            case 'rise_fall':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='call'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='put'
                            />
                        </div>
                    </div>
                );
                break;
            case 'high_low':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='call_barrier'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='put_barrier'
                            />
                        </div>
                    </div>
                );
                break;
            case 'end':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='expirymiss'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='expiryrange'
                            />
                        </div>
                    </div>
                );
                break;
            case 'stay':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='range'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='upordown'
                            />
                        </div>
                    </div>
                );
                break;
            case 'match_diff':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitmatch'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitdiff'
                            />
                        </div>
                    </div>
                );
                break;
            case 'even_odd':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitodd'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digiteven'
                            />
                        </div>
                    </div>
                );
                break;
            case 'over_under':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitover'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='digitunder'
                            />
                        </div>
                    </div>
                );
                break;
            case 'touch':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='onetouch'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='notouch'
                            />
                        </div>
                    </div>
                );
                break;
            case 'asian':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='asianu'
                            />
                        </div>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='asiand'
                            />
                        </div>
                    </div>
                );
                break;
            case 'lb_call':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='lbfloatcall'
                            />
                        </div>
                    </div>
                );
                break;
            case 'lb_put':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='lbfloatput'
                            />
                        </div>
                    </div>
                );
                break;
            case 'lb_high_low':
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='lbhighlow'
                            />
                        </div>
                    </div>
                );
                break;
            default:
                IconCategory = (
                    <div className='categories-container'>
                        <div className='category-wrapper'>
                            <IconTradeType
                                className='category-type'
                                type='unknown'
                            />
                        </div>
                    </div>
                );
                break;
        }
    }
    return (
        <React.Fragment>
            {IconCategory}
        </React.Fragment>
    );
};

IconTradeCategory.propTypes = {
    category: PropTypes.string,
};

export { IconTradeCategory };
