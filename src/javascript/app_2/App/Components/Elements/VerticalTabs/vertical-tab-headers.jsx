import React from 'react';

class VerticalTabHeaders extends React.PureComponent {
    render () {
        return (
            <React.Fragment>
                <div className='vertical-tab__tab'>
                    {this.props.items.map(item => (
                        <a key={item.label} onClick={this.props.onClick.bind(this, item)} className='vertical-tab__header-link'>
                            {item.label}
                        </a>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

export { VerticalTabHeaders };
