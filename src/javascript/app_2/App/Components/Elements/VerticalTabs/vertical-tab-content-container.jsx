import React from 'react';

class VerticalTabContentContainer extends React.PureComponent {
    render() {
        return (
            <div className='vertical-tabs__content'>
                {this.props.items.map(item => {
                    const TabContent = item.value;
                    return <TabContent
                        key={item.label}
                        className='item-id'
                    />;
                })}
            </div>
        );
    }
}

export { VerticalTabContentContainer };
