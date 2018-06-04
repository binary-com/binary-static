import React from 'react';
import PropTypes from 'prop-types';
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
        const minimized_param_values = React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
                is_minimized: true,
            })
        );

        const param_pickers = React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
                is_nativepicker: true,
            })
        );

        return (
            <React.Fragment>
                <div className='mobile-widget' onClick={this.handleWidgetClick}>
                    {minimized_param_values}
                </div>

                <FullscreenDialog
                    title='Set parameters'
                    visible={this.state.open}
                    onClose={this.handleDialogClose}
                >
                    {param_pickers}
                </FullscreenDialog>
            </React.Fragment>
        );
    }
}

MobileWidget.propTypes = {
    children: PropTypes.array,
};

export default MobileWidget;
