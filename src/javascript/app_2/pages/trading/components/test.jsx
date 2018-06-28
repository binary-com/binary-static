import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from '../../../store/connect';

class Test extends React.PureComponent {
    state         = { is_visible: false };
    setVisibility = this.stateVisibility.bind(this);
    styles        = {
        container: {
            fontSize  : '10px',
            lineHeight: '15px',
            position  : 'absolute',
            zIndex    : 1,
            background: 'rgba(0, 0, 0, 0.7)',
            color     : 'white',
            padding   : '10px',
            display   : 'none',
        },
        prop_name: {
            color: 'yellowgreen',
        },
    };

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
            <div id='state_info' style={Object.assign({}, this.styles.container, { display: this.state.is_visible ? 'block' : 'none' })}>
                {this.props.entries.sort().map(([k, v]) => k !== 'main_store' && <div key={k}><strong style={this.styles.prop_name}>{k}:</strong> {v && typeof v === 'object' ? JSON.stringify(v) : v}</div>)}
            </div>
        );
    }
}

Test.propTypes = {
    entries: PropTypes.array,
};

export default connect(
    ({ trade }) => ({
        entries: Object.entries(trade),
    })
)(Test);
