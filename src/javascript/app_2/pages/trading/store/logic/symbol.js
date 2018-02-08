import ContractType from './contract_type';

const onSymbolChange = (new_value) => ContractType.getContractsList(new_value).then(r => ({ contract_types_list: r }));

export default onSymbolChange;
