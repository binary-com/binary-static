import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from '../../../store/connect';

class Test extends React.PureComponent {
    state = { is_visible: false };
    setVisibility = this.stateVisibility.bind(this);

    componentDidMount = () => {
        document.addEventListener('keyup', this.setVisibility, false);
    };

    componentWillUnmount = () => {
        document.removeEventListener('keyup', this.setVisibility);
    };

    stateVisibility(e) {
        if (e.ctrlKey && e.keyCode === 83) { // Ctrl + S
            this.setState({ is_visible: !this.state.is_visible });
        }
    }

    render() {
        return (
            <div id='state_info' style={{ fontSize: '10px', lineHeight: '15px', position: 'absolute', zIndex: 1, opacity: 0.6, display: this.state.is_visible ? 'block' : 'none' }}>
                {this.props.entries.map(([k, v]) => <div key={k}><strong>{k}:</strong> {v && typeof v === 'object' ? JSON.stringify(v) : v}</div>)}
            </div>
        );
    }
}

Test.propTypes = {
    entries: PropTypes.array,
    json   : PropTypes.string,
};

export default connect(
    ({ trade }) => ({
        entries: Object.entries(trade),
        json   : JSON.stringify(trade).replace(/(:|,)/g, '$1 '),
    })
)(Test);
