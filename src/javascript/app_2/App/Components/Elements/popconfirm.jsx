import React        from 'react';
import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import { localize } from '../../../../_common/localize';

class PopConfirm extends React.PureComponent {
    state = {
        is_open: false,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    }

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_open) {
            this.setState({ is_open: false });
        }
    }

    handleClose = () => {
        this.setState({ is_open: false });
    }

    render() {
        const popconfirm_class = classNames('popconfirm', this.props.alignment, {
            'open': this.state.is_open,
        });

        const popconfirm_element = (
            <div ref={this.setWrapperRef} className={popconfirm_class}>
                <div className='popconfirm-title'>
                    {/* TO-DO - Move inline svg to sprite or component with other svg once assets are finalized */}
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
                        <g fill='none' fillRule='evenodd'><circle cx='8' cy='8' r='8' fill='#FFC107'/>
                            <g fill='#FFF' transform='matrix(1 0 0 -1 6.5 12)'>
                                <circle cx='1.5' cy='1' r='1'/>
                                <path d='M1.5 3c.6 0 1 .4 1 1v3a1 1 0 1 1-2 0V4c0-.6.4-1 1-1z'/>
                            </g>
                        </g>
                    </svg>
                    <h4>{localize(this.props.message)}</h4>
                </div>
                <div className='popconfirm-buttons'>
                    <div
                        className='btn flat effect'
                        onClick={this.handleClose}
                    >
                        <span>{localize(this.props.cancel_text)}</span>
                    </div>
                    <div
                        className='btn flat effect'
                        onClick={this.props.children.props.onClick}
                    >
                        <span>{localize(this.props.confirm_text)}</span>
                    </div>
                </div>
            </div>
        );
        return (
            <React.Fragment>
                {React.Children.map(this.props.children, child => (
                    React.cloneElement(child, {
                        onClick: () => this.setState({ is_open: !this.state.is_open }),
                    }, popconfirm_element)
                ))}
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
