import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import ContractTypeItem               from './contract_type_item.jsx';

const ContractTypeList = ({
    handleInfoClick,
    handleSelect,
    list,
    name,
    value,
}) =>
    (
        Object.keys(list).map(key => (
            // TODO: Remove this line after other contracts are ready to be served
            !['In/Out', 'Asians'].includes(key) &&
            <React.Fragment key={key}>
                <div className='list-group'>
                    <div className='list-label'><span>{key}</span></div>
                    <div className='list-items'>
                        <ContractTypeItem
                            contracts={list[key]}
                            name={name}
                            value={value}
                            handleSelect={handleSelect}
                            handleInfoClick={handleInfoClick}
                        />
                    </div>
                </div>
            </React.Fragment>
        ))
    );

ContractTypeList.propTypes = {
    handleInfoClick: PropTypes.func,
    handleSelect   : PropTypes.func,
    list           : MobxPropTypes.objectOrObservableObject,
    name           : PropTypes.string,
    value          : PropTypes.string,
};

export default ContractTypeList;
