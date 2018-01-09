import React from 'react';
import { TextField } from './form/text_field.jsx';

class Duration extends React.PureComponent {
    render() {
        const units = {
            t: 'ticks',
            s: 'seconds',
            m: 'minutes',
            h: 'hours',
            d: 'days',
        };
        return (
            <fieldset>
                <select name='expiry_type' value={this.props.expiry_type} onChange={this.props.onChange}>
                    <option value='duration'>Duration</option>
                    <option value='endtime'>End Time</option>
                </select>

                {this.props.expiry_type === 'duration' ?
                    <React.Fragment>
                        <TextField name='duration' value={this.props.duration} onChange={this.props.onChange} />
                        <select name='duration_unit' value={this.props.duration_unit} onChange={this.props.onChange}>
                            {Object.keys(units).map((u) => (
                                <option key={u} value={u}>{units[u]}</option>
                            ))}
                        </select>
                    </React.Fragment> :
                    <React.Fragment>
                        <input type='date' name='expiry_date' onChange={this.props.onChange} />
                        <input type='time' name='expiry_time' onChange={this.props.onChange} />
                    </React.Fragment>
                }
            </fieldset>
        );
    }
}

module.exports = Duration;
