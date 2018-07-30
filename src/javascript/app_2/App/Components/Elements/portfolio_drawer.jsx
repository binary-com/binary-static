// import { PropTypes as MobxPropTypes } from 'mobx-react';
import classNames                     from 'classnames';
import moment                         from 'moment';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from '../../../Stores/connect';
import { localize }                   from '../../../../_common/localize';

class PortfolioDrawer extends React.Component {
    render() {
        return (
            <div className='portfolio-drawer'>
                <div className='portfolio-drawer__header'>
                    <span className='portfolio-drawer__icon-main' />
                    <span>{localize('Portfolio Quick Menu')}</span>
                    <a
                        href='javascript:;'
                        className='portfolio-drawer__icon-close'
                        onClick={this.props.toggleDrawer}
                    />
                </div>
                <div className='portfolio-drawer__body'>
                    content here
                </div>
            </div>
        );
    }
}

PortfolioDrawer.propTypes = {
    toggleDrawer: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        toggleDrawer: ui.togglePortfolioDrawer,
    })
)(PortfolioDrawer);
