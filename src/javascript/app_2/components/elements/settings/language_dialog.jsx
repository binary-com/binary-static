import classNames   from 'classnames';
import React        from 'react';
import PropTypes    from 'prop-types';
import { localize } from '../../../../_common/localize';
import { connect }  from '../../../store/connect';

class LanguageDialog extends React.PureComponent {
    render() {
        const language_dialog_class = classNames('language-dialog-container', {
            'show': this.props.is_visible,
        });
        return (
            <div className={language_dialog_class}>
                <a className='language-header' href='javascript:;' onClick={this.props.hide}>
                    <span>{localize('language')}</span>
                </a>
                <div className='language-container'>
                    {this.props.list.languages.map((language, idx) => (
                        <React.Fragment key={idx}>
                            <div className='language-row'>
                                <i className={`flag ic-flag-${language.id.toLowerCase()}`} />
                                <span>{language.name}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }
};

LanguageDialog.propTypes = {
    is_visible: PropTypes.bool,
    hide      : PropTypes.func,
    list      : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
};

export default connect(
    ({ ui }) => ({
        list      : ui.supported_languages,
        is_visible: ui.is_language_dialog_on,
        hide      : ui.hideLanguageDialog,
    })
)(LanguageDialog);
