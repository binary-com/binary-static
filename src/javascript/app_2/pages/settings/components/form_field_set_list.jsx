import React from 'react';
import PropTypes from 'prop-types';
import { FormFieldSet } from './form_field_set.jsx';
import { metaData } from './meta_data';

export const FormFieldSetList = ({ data, onChange }) => (
    <div className='settings__fieldset_list'>
        {
            Object.keys(data).map((key, i) => {
                if (metaData[key]) {
                    const { label_name, type, helper } = metaData[key];
                    return (
                        <FormFieldSet
                            key={i}
                            type={type}
                            label_name={label_name}
                            onChange={onChange}
                            value={data[key]}
                            name={key}
                            helper={helper}
                        />
                    );
                }
                return null;
            })
        }
    </div>
);

FormFieldSetList.propTypes = {
    data    : PropTypes.object,
    onChange: PropTypes.func,
};
