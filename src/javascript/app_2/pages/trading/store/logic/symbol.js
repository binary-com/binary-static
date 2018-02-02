import { getContractTypes } from './contract_type';

const onSymbolChange = (new_value) => getContractTypes(new_value);

export default onSymbolChange;
