import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import { getTableColumnsTemplate }    from '../Constants/data_table_constants';
import DataTable                      from '../../../App/Components/Elements/data_table.jsx';

const StatementTable = ({
    data,
}) => {
    const columns = getTableColumnsTemplate();
    return (
        <div className='statement__content'>
            <DataTable
                data_source={data.slice()}
                columns={columns}
                has_fixed_header
            />
        </div>
    );
};

StatementTable.propTypes = {
    data: MobxPropTypes.arrayOrObservableArray,
};

export default StatementTable;
