import React from 'react';
import ReactDOM from 'react-dom';
import Defaults from './defaults';
import {getElementById} from '../../../_common/common_functions';

class Contracts extends React.Component {
    constructor (props) {
        super(props);
        const {contracts, contracts_tree} = props;
        const formname = Defaults.get('formname');
        this.references = {};
        this.$contract = getElementById('contract');
        this.$contract.value = formname;
        this.state = {
            contracts,
            contracts_tree,
            formname,
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
        if (this.state.contracts_tree.length <= 1) return;
        this.setState({open: true});
        this.positionDropDown();
    };
    closeDropDown = () => this.setState({open: false});

    positionDropDown = () => {
        const $dropdown = this.references.wrapper;
        const pos = $dropdown.getBoundingClientRect();

        if ((pos.x + pos.width + 20) > window.innerWidth) {
            // 20 is padding right for the element
            $dropdown.style.left = `${window.innerWidth - (pos.x + pos.width + 20)}px`;
        } else if ((pos.x + pos.width + 20) !== window.innerWidth) {
            $dropdown.style.left = 0;
        }
    }

    saveRef = (name, node) => { this.references[name] = node; };

    getType = () => {
        const {formname, contracts} = this.state;
        let type = '';
        this.state.contracts_tree.forEach((e) => {
            if (typeof e === 'object') {
                e[1].forEach((subtype) => {
                    if (subtype === formname) {
                        type = e[0];
                    }
                });
            } else if (e === formname) {
                type = e;
            }
        });

        return contracts[type];
    }

    onContractClick = (formname) => {
        setTimeout(this.closeDropDown, 500);
        if (formname === this.state.formname) { return; }
        Defaults.set('formname', formname);
        // Notify for changes on contract.
        this.$contract.value = formname;
        const event = new Event('change');
        this.$contract.dispatchEvent(event);

        this.setState({formname});
    }

    render () {
        const { contracts, contracts_tree, open,
            formname } = this.state;

        return (
            <div className='contracts'>
                <div
                    className='contract_current'
                    onClick={this.openDropDown}
                >
                    <span className='type'>{this.getType()}</span>
                    <span className='contract'>{contracts[formname]}</span>
                </div>
                <div
                    className={`contracts_dropdown ${open ? '' : 'hidden'}`}
                    ref={this.saveRef.bind(null, 'wrapper')}
                >
                    { contracts_tree.map((contract, idx) => {
                        if (typeof contract === 'object') {
                            return (
                                <div className='contract' key={idx}>
                                    <div className='contract_type'>{contracts[contract[0]]}</div>
                                    <div className='contract_subtypes'>
                                        {contract[1].map((subtype, i) =>
                                            <div
                                                className={`sub ${subtype === formname ? 'active' : ''}`}
                                                key={i}
                                                onClick={this.onContractClick.bind(null, subtype)}
                                            >
                                                {contracts[subtype]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        } 
                        return (
                            <div className='contract' key={idx}>
                                <div className='contract_type'>{contracts[contract]}</div>
                                <div className='contract_subtypes'>
                                    <div
                                        className={`sub ${contract === formname ? 'active' : ''}`}
                                        onClick={this.onContractClick.bind(null, contract)}
                                    >
                                        {contracts[contract]}
                                    </div>
                                </div>
                            </div>
                        );
                        
                    }
                    )}
                </div>
            </div>
        );
    }
}
/* eslint-disable react/no-render-return-value*/
export const init = (contracts, contracts_tree) => ReactDOM.render(
    <Contracts contracts={contracts} contracts_tree={contracts_tree}/>,
    getElementById('contract_component')
);
/* eslint-enable react/no-render-return-value */

export default init;
