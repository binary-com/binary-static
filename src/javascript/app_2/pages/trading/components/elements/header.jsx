import React from 'react';
import { ToggleDrawer, DrawerItem } from './drawer.jsx';

const Url = require('../../../../../_common/url');

class TradingHeader extends React.Component {

    render() {
        return (
            <React.Fragment>
                <header id={this.props.id} className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left'>
                                <DrawerItem text='First Page'/>
                                <DrawerItem text='Second Page'/>
                                <DrawerItem text='Third Page'/>
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/pages/binary-symbol-logo.svg')} alt='Binary.com' />
                            </div>
                            { this.props.items.length ?
                              <div className='menu-links'>
                                  {this.props.items.map((item, idx) => (
                                      <a key={idx} href={item.href || 'javascript:;'} >
                                          <span className={item.icon}>{item.text}</span>
                                      </a>
                                  ))}
                              </div>
                              :
                              undefined
                            }
                        </div>
                        <ToggleDrawer alignment='right'>
                        </ToggleDrawer>
                    </div>
                </header>
          </React.Fragment>
        );
    }
}

export default TradingHeader;
