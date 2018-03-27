import React from 'react';
import FullscreenDialog from './fullscreen_dialog.jsx';

class MobileWidget extends React.PureComponent {
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
        const minimized_children = React.Children.map(this.props.children, child => 
            React.cloneElement(child, {
                is_minimized: true,
            }));

        const full_children = React.Children.map(this.props.children, child => 
            React.cloneElement(child, {
                is_nativepicker: true,
            }));

        return (
            <React.Fragment>
                <div className='mobile-widget' onClick={this.handleWidgetClick}>
                    {minimized_children}
                </div>
                
                <FullscreenDialog
                    title='Set parameters'
                    visible={this.state.open}
                    onClose={this.handleDialogClose}
                >
                    {full_children}
                </FullscreenDialog>
            </React.Fragment>
        );
    }
}

export default MobileWidget;
