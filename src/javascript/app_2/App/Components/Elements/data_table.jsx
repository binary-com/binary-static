import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import PerfectScrollbar               from 'react-perfect-scrollbar';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.PureComponent {
    renderRow(row_obj, is_footer = false, id = 0) {
        if (!row_obj) return null;

        return (
            <div className='table__row' key={id}>
                {this.props.columns.map(({ col_index, renderCellContent }) => {
                    const cell_value = row_obj[col_index] || '';

                    return (
                        <div className={classNames('table__cell', col_index)} key={col_index}>
                            {renderCellContent
                                ? renderCellContent({ cell_value, col_index, row_obj, is_footer })
                                : cell_value
                            }
                        </div>
                    );
                })}
            </div>
        );
    }

    renderBodyRows() {
        return this.props.data_source
            .map((row_obj, id) => this.renderRow(row_obj, false, id));
    }

    renderHeaders() {
        return this.props.columns.map(col =>
            <div className={classNames('table__cell', col.col_index)} key={col.col_index}>
                {col.title}
            </div>
        );
    }

    render() {
        return (
            <div className='table'>
                <div className='table__head'>
                    <div className='table__row'>
                        {this.renderHeaders()}
                    </div>
                </div>

                {this.props.footer &&
                    <div className='table__foot'>
                        {this.renderRow(this.props.footer, true)}
                    </div>
                }
                
                <PerfectScrollbar>
                    <div className='table__body'>
                        {this.renderBodyRows()}
                    </div>
                </PerfectScrollbar>
            </div>
        );
    }
}

DataTable.propTypes = {
    columns         : PropTypes.array,
    data_source     : MobxPropTypes.arrayOrObservableArray,
    footer          : PropTypes.object,
    has_fixed_header: PropTypes.bool,
};



export default DataTable;
