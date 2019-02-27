import React                       from 'react';
import { VerticalTabHeaders }          from './vertical-tab-headers.jsx';
import { VerticalTabContentContainer } from './vertical-tab-content-container.jsx';

class VerticalTab extends React.PureComponent {
    changeSelected(e) {
        this.selected = e.target.value;
    }

    render() {
        return (
            <div className='vertical-tab'>
                <VerticalTabHeaders
                    items={this.props.list}
                    onClick={this.changeSelected}
                />
                <VerticalTabContentContainer items={this.props.list} selected={this.selected} />
            </div>
        );
    }
}

export { VerticalTab };
