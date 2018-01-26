import React from 'react';
import { MdcTextField } from './form/text_field.jsx';
import { MdcSelect } from './form/select_box.jsx';
import { connect } from '../store/connect';

const Duration = ({
    expiry_type,
    duration,
    duration_unit,
    units,
    onExpiryTypeChange,
    onExpiryDateChange,
    onExpiryTimeChange,
    onDurationChange,
    onDurationUnitChange,
}) =>  (
        <fieldset className='shadow-1'>
            <div className='gr-row'>
                <div className='gr-12'>
                    <MdcSelect name='expiry_type'
                               default_value={expiry_type}
                               on_change={onExpiryTypeChange}>
                        <option value='duration'>Duration</option>
                        <option value='endtime'>End Time</option>
                    </MdcSelect>
                </div>
                {expiry_type === 'duration' ?
                    <React.Fragment>
                        <div className='gr-6'>
                            <MdcTextField id='duration'
                                          type='text'
                                          name='duration'
                                          value={duration}
                                          on_change={onDurationChange}
                                          input_width='300px'
                            />
                            </div>
                            <div className='gr-6'>
                                <MdcSelect name='duration_unit'
                                           default_value={duration_unit}
                                           on_change={onDurationUnitChange}>
                                           {Object.keys(units).map((u) => (
                                               <option key={u} value={u}>{units[u]}</option>
                                           ))}
                                </MdcSelect>
                            </div>
                    </React.Fragment> :
                    <React.Fragment>
                        <div className='gr-8'>
                            <MdcTextField type='date' name='expiry_date' on_change={onExpiryDateChange} />
                        </div>
                        <div className='gr-4'>
                            <MdcTextField type='time' name='expiry_time' on_change={onExpiryTimeChange} />
                        </div>
                    </React.Fragment>
                }
            </div>
        </fieldset>
);

export default connect(
    ({trade}) => ({
        expiry_type  : trade.expiry_type,
        duration     : trade.duration,
        duration_unit: trade.duration_unit,
        units        : {
            t: 'ticks',
            s: 'seconds',
            m: 'minutes',
            h: 'hours',
            d: 'days',
        },
        onExpiryTypeChange  : trade.handleChange,
        onExpiryDateChange  : trade.handleChange,
        onExpiryTimeChange  : trade.handleChange,
        onDurationChange    : trade.handleChange,
        onDurationUnitChange: trade.handleChange,
    })
)(Duration);
