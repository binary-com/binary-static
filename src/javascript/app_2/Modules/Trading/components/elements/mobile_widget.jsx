import React            from 'react';
import FullscreenDialog from './fullscreen_dialog.jsx';
import TradeParams      from '../../Containers/trade_params.jsx';

class MobileWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleWidgetClick = this.handleWidgetClick.bind(this);
    }

    handleWidgetClick() {
        this.setState({
            open: true,
        });
    }

    handleDialogClose() {
        this.setState({
            open: false,
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className='mobile-widget' onClick={this.handleWidgetClick}>
                    <TradeParams is_minimized />
                </div>

                <FullscreenDialog
                    title='Set parameters'
                    visible={this.state.open}
                    onClose={this.handleDialogClose}
                >
                    <TradeParams is_nativepicker />
                </FullscreenDialog>
            </React.Fragment>
        );
    }
}

export default MobileWidget;
