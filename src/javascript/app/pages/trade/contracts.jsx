import React from 'react';
import ReactDOM from 'react-dom';
import Defaults from './defaults.js';

class Contracts extends React.Component {
    constructor (props) {
        super(props);
        const {contracts, contracts_map} = props;
        this.references = {};
        this.state = {
            contracts,
            contracts_map,
            formname: Defaults.get('formname'),
            open: false,
        };
    }

    componentDidMount () {
        document.body.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount () {
        document.body.removeEventListener('click', this.closeDropdown);
    }

    handleClickOutside = (e) => {
        if (this.references.wrapper
            && !this.references.wrapper.contains(e.target)) {
            this.closeDropDown();
        }
    }

    openDropDown = () => {
        if (this.state.contracts_map.length <= 1) return;
        this.setState({open: true})
    };
    closeDropDown = () => this.setState({open: false});

    saveRef = (name, node) => { this.references[name] = node };

    render () {
        const {contracts, contracts_map, open} = this.state;

        return (
            <div className='contracts'>
                <div
                    className='contract_current'
                    onClick={this.openDropDown}
                >
                    <span className='type'>Up/Down</span>
                    <span className='contract'>Higher/Lower</span>
                </div>
                <div
                    className={`contracts_dropdown ${open ? '' : 'hidden'}`}
                    ref={this.saveRef.bind(null, 'wrapper')}
                >
                    { contracts_map.map((contract, idx) => {
                        if (typeof contract === 'object') {
                            return (
                                <div className='contract' key={idx}>
                                    <div className='contract_type'>{contracts[contract[0]]}</div>
                                    <div className='contract_subtypes'>
                                        {contract[1].map((subtype, i) =>
                                            <div className='sub' key={i}>{contracts[subtype]}</div>
                                        )}
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div className='contract' key={idx}>
                                    <div className='contract_type'>{contracts[contract]}</div>
                                    <div className='contract_subtypes'>
                                        {contracts[contract]}
                                    </div>
                                </div>
                            )
                        }
                    }
                    )}
                </div>
            </div>
        );
    }
}

export const init = (contracts, contracts_map) => ReactDOM.render(
    <Contracts contracts={contracts} contracts_map={contracts_map}/>,
    document.getElementById('contract_component')
);

export default init;
