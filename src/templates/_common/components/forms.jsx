import React from 'react';

export const Fieldset = ({ children, legend, id, className }) => (
    <fieldset id={id} className={className}>
        {legend &&
            <legend>{legend}</legend>
        }
        {children}
    </fieldset>
);

export const FormRow = ({
    autoComplete,
    spaced,
    type,
    id,
    className,
    label,
    checked,
    row_class,
    row_id,
    sub_row_class,
    label_row_class,
    is_two_rows,
    is_bold,
    tooltip,
    hint,
    has_password_meter,
    has_geovalidator,
    attributes = {},
    input_prefix,
    required,
    children,
    options,
    default_option,
}) => {
    const getInnerElement = () => {
        if (type === 'select') {
            return (
                <select id={id} className={`form_input ${className || ''}`} {...attributes} >
                    {children}
                </select>
            );
        }
        if (type === 'radio') {
            return (
                <div id={id} className={className}>
                    {options.map(({ value, label: label_text, data_balloon_text, textfield_id }, i) => {
                        const option_id = `${id}_option_${i}`;
                        return (
                            <div key={value}>
                                <input
                                    type='radio'
                                    name={id}
                                    id={option_id}
                                    value={value}
                                    defaultChecked={value === default_option}
                                />
                                <label htmlFor={option_id}>
                                    <span data-balloon={data_balloon_text} data-balloon-length='medium'>
                                        {label_text}
                                    </span>
                                </label>
                                {textfield_id &&
                                    <input
                                        type='text'
                                        id={textfield_id}
                                    />
                                }
                            </div>
                        );
                    })}
                </div>
            );
        }
        if (type === 'textarea') {
            return (
                <React.Fragment>
                    <textarea className={className} id={id} {...attributes} />
                    <label htmlFor={id} />
                </React.Fragment>
            );
        }
        if (['text', 'password', 'number', 'checkbox'].includes(type)) {
            return (
                <React.Fragment>
                    {input_prefix}
                    {type === 'password' ?
                        <div className='password--field-wrapper'>
                            <input
                                autoComplete={autoComplete}
                                type='password'
                                className={`password--input-field ${className || ''}`}
                                id={id}
                                data-password={has_password_meter}
                                {...attributes}
                            />
                            <div id='password_toggle' className='password--toggle'>
                                <img
                                    id='password_toggle_icon'
                                    alt='toggle-password-view'
                                    className='password-toggle-icon'
                                    src={it.url_for('images/common/password_hide.svg')}
                                />
                            </div>
                        </div>
                        :
                        <input
                            type={type}
                            className={className}
                            id={id}
                            {...attributes}
                        />
                    }
                    {type === 'checkbox' && spaced ?
                        <label htmlFor={id} />
                        :
                        undefined
                    }
                </React.Fragment>
            );
        }
        if (type === 'label') {
            return (
                <span className='text-display'>
                    {is_bold ? <strong id={id} {...attributes} /> : <span id={id} {...attributes} />}
                </span>
            );
        }
        return type === 'custom' ? children : undefined;
    };

    const inner_el_classname = () => {
        if (is_two_rows) {
            return 'gr-12';
        } else if (has_geovalidator) {
            return 'gr-3 gr-12-m';
        }
        return `gr-8 gr-12-m ${sub_row_class || ''}`;
    };

    if (type === 'checkbox' && !spaced) {
        return (
            <div className={`gr-row ${row_class || ''}`} id={row_id}>
                <div className='gr-12 gr-padding-20 gr-centered'>
                    <input id={id} type='checkbox' defaultChecked={!!checked} />
                    &nbsp;
                    <label htmlFor={id}>{label}</label>
                </div>
            </div>
        );
    }
    return (
        <div
            className={`gr-row form-row center-text-m ${is_two_rows ? 'two-rows' : ''} ${row_class || ''}`}
            id={row_id}
        >
            <div className={`${is_two_rows ? `gr-12 ${label_row_class}` : `gr-4 gr-12-m ${label_row_class}`}`}>
                <label htmlFor={type !== 'label' ? id : undefined} className={required ? 'required_asterisk' : ''}>
                    {tooltip ?
                        <span data-balloon-length='xlarge' data-balloon={tooltip}>
                            {label}
                        </span> :
                        label
                    }
                </label>
            </div>
            <div className={inner_el_classname()}>
                {getInnerElement()}
                {hint &&
                    <p className='hint no-margin'>{hint}</p>
                }
            </div>
            {has_geovalidator ? children : undefined}
        </div>
    );
};

export const SubmitButton = ({
    is_centered,
    className,
    type,
    text,
    id,
    is_full_width,
    is_left_align,
    no_error,
    msg_id,
    attributes,
    no_wrapper,
    custom_btn_text,
    custom_btn_class,
    custom_btn_href,
    custom_btn_id,
    custom_msg_text,
}) => {
    const content =
        <React.Fragment>
            { !no_error &&
                <p
                    id={msg_id || 'msg_form'}
                    className={`${is_centered ? 'center-text' : ''} error-msg no-margin invisible`}
                />
            }
            <div className='gr-padding-10'>
                { custom_btn_text &&
                    <a
                        className={`button ${custom_btn_class || ''}`}
                        href={custom_btn_href || 'javascript:;'}
                        id={custom_btn_id}
                    >
                        <span className='button'>{custom_btn_text}</span>
                    </a>
                }
                { custom_msg_text &&
                    <p className={`${is_centered ? 'center-text' : ''}`}>{custom_msg_text}</p>
                }
                <button
                    id={id || 'btn_submit'}
                    type={type === 'submit' ? 'submit' : undefined}
                    {...attributes}
                    className={`button${is_full_width ? ' full-width' : ''}`}
                >
                    {text}
                </button>
            </div>
        </React.Fragment>;

    if (!no_wrapper) {
        return (
            <div className={`${is_centered ? 'center-text' : 'gr-row'} ${className || ''}`} id={id}>
                { !is_centered ?
                    <div className={`${!is_left_align ? 'gr-8 gr-push-4 gr-12-m gr-push-0-m' : ''} center-text-m`}>
                        {content}
                    </div> :
                    content
                }
            </div>
        );
    }
    return content;
};
