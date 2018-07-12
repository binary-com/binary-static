import React        from 'react';
import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import Button       from '../Form/button.jsx';
import { localize } from '../../../../_common/localize';

class PopConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
        };
        this.handleClose        = this.handleClose.bind(this);
        this.setWrapperRef      = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapper_ref = node;
    }

    handleClickOutside(event) {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_open) {
            this.setState({ is_open: false });
        }
    }

    handleClose() {
        this.setState({ is_open: false });
    }

    render() {
        const popconfirm_class = classNames('popconfirm', this.props.alignment, {
            'open': this.state.is_open,
        });

        const cloned_element = React.Children.map(this.props.children, child => (
            React.cloneElement(child, {
                onClick: () => this.setState({ is_open: !this.state.is_open }),
            })
        ));
        return (
            <React.Fragment>
                {cloned_element}
                <div ref={this.setWrapperRef} className={popconfirm_class}>
                    <div className='popconfirm-title'>
                        {localize('Are you sure you want to purchase this contract?')}
                    </div>
                    <div className='popconfirm-buttons'>
                        <Button
                            className='flat'
                            has_effect
                            text={localize('close')}
                            onClick={this.handleClose}
                        />
                        <Button
                            className='flat'
                            has_effect
                            text={localize('purchase')}
                            onClick={this.props.children.props.onClick}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

PopConfirm.propTypes = {
    alignment   : PropTypes.string,
    children    : PropTypes.object,
    cancel_text : PropTypes.string,
    confirm_text: PropTypes.string,
    message     : PropTypes.string,
};

export default PopConfirm;
