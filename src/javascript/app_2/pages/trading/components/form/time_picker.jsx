import React, {PureComponent} from 'react';
import RcTimePicker from 'rc-time-picker';

class TimePicker extends PureComponent {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: false,
        };
    }

    handleClick () {
        this.setState({open: true});
        console.log(1)
    }

    render () {
        return (
            <React.Fragment>
                <RcTimePicker
                    prefixCls='time-picker'
                    use12Hours
                    format='h:mm a'
                    inputReadOnly
                    showSecond={false}
                    {...this.props}
                />
            </React.Fragment>
        )
    }
}

export default TimePicker;
