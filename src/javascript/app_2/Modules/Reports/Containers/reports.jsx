import React                 from 'react';
import { withRouter }        from 'react-router-dom';
import { localize }          from '_common/localize';
import VerticalTab           from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import { IconOpenPositions } from 'Assets/Reports/icon-open-positions.jsx';
import { IconProfitTable }   from 'Assets/Reports/icon-profit-table.jsx';
import { IconStatement }     from 'Assets/Reports/icon-statement.jsx';
import { connect }           from 'Stores/connect';
import Statement             from './statement.jsx';
import { ProfitTable }       from './profit-table.jsx';
import { OpenPositions }     from './open-positions.jsx';

class Reports extends React.Component {
    // menu_options = () => {
    //     const options = [];
    //
    //     this.props.routes.forEach(route => {
    //         options.push({
    //             icon : route.icon_component,
    //             label: route.title,
    //             value: route.component,
    //         });
    //     });
    //
    //     console.log(options);
    //     console.log(typeof options);
    //     return options;
    // };
    menu_options = () => ([
        {
            icon : IconOpenPositions,
            label: localize('Open Positions'),
            value: OpenPositions,
        }, {
            icon : IconProfitTable,
            label: localize('Profit Table'),
            value: ProfitTable,
        }, {
            icon : IconStatement,
            label: localize('Statement'),
            value: Statement,
        },
    ]);

    render() {
        // console.log(this.props);
        // console.log(this.props.match);
        //
        // console.log(this.menu_optionss());
        // console.log(typeof this.menu_optionss());
        return (
            <div className='reports'>
                <VerticalTab
                    alignment='center'
                    classNameHeader='reports__tab-header'
                    list={this.menu_options()}
                />
            </div>
        );
    }
}

export default connect(
    ({ ui }) => ({
        is_mobile: ui.is_mobile,
    })
)(withRouter(Reports));
