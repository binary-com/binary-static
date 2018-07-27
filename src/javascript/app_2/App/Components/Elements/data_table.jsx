import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.PureComponent {
    componentDidUpdate() {
        this.alignHeader();
    }

    alignHeader() {
        // scrollbar inside body table can push content (depending on the browser and if mouse is plugged in)
        if (!this.props.data_source.length) return;

        const first_body_row   = this.el_table_body.firstChild;
        const body_row_width   = first_body_row.offsetWidth;
        const header_row_width = this.el_header_row.offsetWidth;

        const original_padding_right = parseInt(window.getComputedStyle(first_body_row, null).getPropertyValue('padding-right'));
        const new_padding_right      = header_row_width - body_row_width + original_padding_right;

        this.el_header_row.style.paddingRight = `${new_padding_right}px`;
    }

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
        const {
            children,
            onScroll,
            footer,
        } = this.props;

        return (
            <div className='table'>
                <div className='table__head'>
                    <div className='table__row' ref={el => { this.el_header_row = el; }}>
                        {this.renderHeaders()}
                    </div>
                </div>
                
                <div
                    className='table__body'
                    onScroll={onScroll}
                    ref={el => { this.el_table_body = el; }}
                >
                    {this.renderBodyRows()}
                    {children}
                </div>

                {this.props.footer &&
                    <div className='table__foot'>
                        {this.renderRow(footer, true)}
                    </div>
                }
            </div>
        );
    }
}

DataTable.propTypes = {
    columns    : PropTypes.array,
    data_source: MobxPropTypes.arrayOrObservableArray,
    footer     : PropTypes.object,
    onScroll   : PropTypes.func,
    children   : PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};



export default DataTable;
