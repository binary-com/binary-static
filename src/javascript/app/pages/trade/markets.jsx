import React from 'react';
import ReactDOM from 'react-dom';
import Symbols from './symbols';
// Should be remove in the future
import Defaults from './defaults';
import {getElementById} from '../../../_common/common_functions';
import {localize} from '../../../_common/localize';

function scrollToPosition (element, to, duration) {
    const requestAnimationFrame = window.requestAnimationFrame ||
        function (...args) {
            return setTimeout(args[0], 10);
        };
    if (duration <= 0) {
        element.scrollTop = to;
        return;
    }
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;
    requestAnimationFrame(() => {
        element.scrollTop += perTick;
        if (element.scrollTop === to) return;
        scrollToPosition(element, to, duration - 10);
    }, 20);
}

const List = ({
    arr,
    saveRef,
    underlying,
    onUnderlyingClick,
}) => (
    arr.map(([market_code, obj], idx) => (
        <div
            className='market'
            key={idx}
            id={`${market_code}_market`}
            ref={saveRef.bind(null,market_code)}
        >
            <div className='market_name'>
                {obj.name}
            </div>
            {Object.values(obj.submarkets).map((submarket, idx_2) => (
                <div className='submarket' key={idx_2}>
                    <div className='submarket_name'>
                        {submarket.name}
                    </div>
                    <div className='symbols'>
                        {Object.entries(submarket.symbols).map(([u_code, symbol]) => (
                            <div
                                className={`symbol_name ${u_code===underlying ? 'active' : ''}`}
                                key={u_code}
                                id={u_code}
                                onClick={onUnderlyingClick.bind(null, u_code, market_code)}
                            >
                                {symbol.display}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ))
);

const submarket_order = {
    forex          : 0,
    major_pairs    : 1,
    minor_pairs    : 2,
    smart_fx       : 3,
    indices        : 4,
    asia_oceania   : 5,
    europe_africa  : 6,
    americas       : 7,
    otc_index      : 8,
    stocks         : 9,
    au_otc_stock   : 10,
    ge_otc_stock   : 11,
    india_otc_stock: 12,
    uk_otc_stock   : 13,
    us_otc_stock   : 14,
    commodities    : 15,
    metals         : 16,
    energy         : 17,
    volidx         : 18,
    random_index   : 19,
    random_daily   : 20,
    random_nightly : 21,
};

const submarketSort = (a, b) => {
    if (submarket_order[a] > submarket_order[b]) {
        return 1;
    } else if (submarket_order[a] < submarket_order[b]) {
        return -1;
    }
    return 0;
};

class Markets extends React.Component {
    constructor (props) {
        super(props);
        const market_symbol = Defaults.get('market');
        this.markets = Symbols.markets();
        let underlying_symbol = Defaults.get('underlying');
        if (!underlying_symbol) {
            const submarket = Object.keys(this.markets[market_symbol].submarkets).sort(submarketSort)[0];
            underlying_symbol = Object.keys(this.markets[market_symbol].submarkets[submarket].symbols).sort()[0];
        }
        const markets_arr = Object.entries(this.markets);
        this.underlyings = Symbols.getAllSymbols() || {};
        this.markets_all = markets_arr.slice();
        this.$underlying = getElementById('underlying');
        this.references = {};
        this.state = {
            open  : false,
            market: {
                symbol: market_symbol,
                name  : this.markets[market_symbol].name,
            },
            underlying: {
                symbol: underlying_symbol,
                name  : this.underlyings[underlying_symbol],
            },
            markets      : markets_arr,
            active_market: market_symbol,
            query        : '',
        };
        this.$underlying.value = underlying_symbol;
    }

    componentDidMount () {
        document.body.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount () {
        document.body.removeEventListener('click', this.closeDropdown);
    }

    /* eslint-disable no-undef */
    closeDropdown = () => {
        this.setState({
            open   : false,
            query  : '',
            markets: this.markets_all,
        });
        this.scrollToElement(this.state.underlying.symbol, 0, 70);
    };

    getCurrentUnderlying = () => {
        const { underlying: {name: underlying} } = this.state;
        const max_char = window.innerWidth <= 767 ? 15 : 25;
        if (underlying.length > max_char) {
            return `${underlying.substr(0, max_char)}...`;
        }
        return underlying;
    }

    handleClickOutside = (e) => {
        if (this.references.wrapper_ref
            && !this.references.wrapper_ref.contains(e.target)) {
            this.closeDropdown();
        }
    }

    handleScroll = (e) => {
        const {market_nodes, list} = this.references;
        const position = e.target.scrollTop;
        const arr = [];
        let curr_market = null;
        Object.entries(market_nodes).forEach(([key, node]) => {
            if (node && node.offsetTop - list.offsetTop - 41 <= position) {
                arr.push(key);
            }
        });
        if (this.state.active_market !== arr[arr.length-1]) {
            this.previous_market = this.state.active_market;
            if (position <=10) {
                curr_market = arr[0];
            } else {
                curr_market = arr[arr.length - 1];
            }
            this.setState({active_market: curr_market});
        }

        this.stickyHeader(market_nodes[curr_market || this.state.active_market].childNodes[0],
            ((market_nodes[this.previous_market] || {}).childNodes || [])[0], position + list.offsetTop);
    }

    openDropdown = () => {
        this.setState({open: true});
        this.scrollToElement(this.state.underlying.symbol, 0, 70);
    };

    onUnderlyingClick = (underlying_symbol, market_symbol) => {
        Defaults.set('underlying', underlying_symbol);
        Defaults.set('market', market_symbol);

        this.setState({
            market: {
                symbol: market_symbol,
                name  : this.markets[market_symbol].name,
            },
            underlying: {
                symbol: underlying_symbol,
                name  : this.underlyings[underlying_symbol],
            },
        });

        // Trigger change event.
        // TODO: move this block to componentDidUpdate
        this.$underlying.value = underlying_symbol;
        this.$underlying.setAttribute('data-text',this.underlyings[underlying_symbol]);
        const event = new Event('change');
        this.$underlying.dispatchEvent(event);

        setTimeout(this.closeDropdown, 500);
        /* Todo add notification for closed markets */
        // Notifications.show({ text: localize('All markets are closed now. Please try again later.'), uid: 'MARKETS_CLOSED' });

    }

    onTabChange = (e) => {
        const market = e.target.dataset.market;
        this.scrollToElement(`${market}_market`, 120, 0);
    }

    saveRef = (node_name, node) => this.references[node_name] = node;

    scrollToElement = (id, duration = 120, offset) => {
        // handleScroll is triggered automatically which sets the active market.
        const {list} = this.references;
        const toOffset = getElementById(id).offsetTop;
        scrollToPosition(list, toOffset - list.offsetTop - offset, duration);
    }

    stickyHeader = (curr, prev, pos) => {
        const sticky = 'sticky';
        const under = 'put_under';
        const MOBILE_TOP = 122;
        const DESKTOP_TOP = 59;
        const DEFAULT_TOP = window.innerWidth < 768 ? MOBILE_TOP : DESKTOP_TOP;
        const diff = curr.offsetTop - pos;
        const diffSub = 40 - diff;
        if (!prev) {
            curr.classList.add(sticky);
            return;
        }
        if (diff > 0) {
            prev.classList.add(under);
            prev.style.top = `${DEFAULT_TOP - diffSub}px`;
        } else {
            prev.removeAttribute('style');
            prev.classList.remove(sticky);
            prev.classList.remove(under);
            curr.classList.add(sticky);
            curr.classList.remove(under);
            curr.removeAttribute('style');
        }
    }

    saveMarketRef = (market, node) => {
        if (!this.references.market_nodes) this.references.market_nodes = {};
        this.references.market_nodes[market] = node;
    }

    searchSymbols = ({target: {value: query}}) => {
        this.setState({query});
        scrollToPosition(this.references.list, 0, 0);
        const markets_all = this.markets_all;
        if (!query) {
            this.setState({markets: markets_all});
            return;
        }
        const filter_markets = [];
        markets_all.map(([key, market]) => {
            let found_for_market = false; // To check market contains any matching underlying.
            const filter_submarkets = {};
            Object.entries(market.submarkets).map(([key_2, submarket]) => {
                let found_for_submarket = false; // Same as found for market
                const filter_symbols = {};
                Object.entries(submarket.symbols).map(([key_3, symbol]) => {
                    const queries = query.split(',');
                    if (
                        queries.reduce((a, b) =>
                            symbol.display.toLowerCase().includes(b.toLowerCase()) || a
                        , false)
                    ) {
                        filter_symbols[key_3] = symbol;
                        found_for_market = true;
                        found_for_submarket = true;
                    }
                });
                if (found_for_submarket) {
                    filter_submarkets[key_2] = JSON.parse(JSON.stringify(submarket));
                    filter_submarkets[key_2].symbols = filter_symbols;
                }
            });
            if (found_for_market) {
                const market_copy = JSON.parse(JSON.stringify(market));
                market_copy.submarkets = filter_submarkets;
                filter_markets.push([key, market_copy]);
            }
        });

        // nothing found
        if (!filter_markets.length) return;

        this.setState({markets: filter_markets, active_market: filter_markets[0][0]});
    }

    /* eslint-disable no-shadow */
    scrollToMarket = (key) => {
        const isScrollingFront = (key) => {
            const keys = Object.keys(this.references.market_nodes);
            const curr = this.state.active_market;
            if (keys.indexOf(key) > keys.indexOf(curr)) {
                return true;
            }
            return false;

        };
        if (isScrollingFront(key)) {
            this.scrollToElement(`${key}_market`, 120, 0);
        } else {
            this.scrollToElement(`${key}_market`, 120, 40);
        }
    }
    /* eslint-enable no-shadow */
    /* eslint-enable no-undef */
    render () {
        const {active_market, markets,
            underlying, query, market} = this.state;
        /* eslint-disable no-unused-vars */
        const { openDropdown, closeDropdown, searchSymbols,
            scrollToElement, handleScroll, saveMarketRef,
            onUnderlyingClick, saveRef, scrollToMarket } = this;
        /* eslint-enable no-unused-vars */
        return (
            <div className='markets'>
                <div
                    className='market_current'
                    onClick={openDropdown}
                >
                    <span className='market'>
                        {market.name}
                        <span className='arrow_down' />
                    </span>
                    <span className='underlying'>{this.getCurrentUnderlying()}</span>
                </div>
                <div
                    className={`markets_dropdown ${this.state.open ? '' : 'hidden'}`}
                    ref={saveRef.bind(null, 'wrapper_ref')}
                >
                    <div className='asset-placeholder mobile'>
                        <span>{localize('Select Asset')}</span>
                        <span className='close' onClick={closeDropdown} />
                    </div>
                    <div className='search'>
                        <input
                            type='text'
                            maxLength={20}
                            onInput={searchSymbols}
                            placeholder={localize('"AUD/JPY" or "Apple"')}
                            value={query}
                        />
                        <span className='icon' />
                    </div>
                    <div className='markets_view'>
                        <div className='markets_column'>
                            <div className='desktop'>
                                {markets.map(([key, obj]) =>
                                    <div
                                        className={`market ${active_market === key ? 'active' : ''}`}
                                        key={key}
                                        onClick={scrollToMarket.bind(null, key)}
                                    >
                                        <span className={`icon ${key} ${active_market === key ? 'active' : ''}`} />
                                        <span>{obj.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className='mobile'>
                                <ul>
                                    {markets.map(([key]) => (
                                        <li
                                            onClick={scrollToMarket.bind(null, key)}
                                            key={key}
                                            data-market={key}
                                            className={active_market === key ? 'active' : ''}
                                        >
                                            <span className={`icon ${key} ${active_market === key ? 'active' : ''}`} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div
                            className='list'
                            ref={saveRef.bind(null, 'list')}
                            onScroll={handleScroll}
                        >
                            <List
                                arr={markets}
                                saveRef={saveMarketRef}
                                underlying={underlying.symbol}
                                onUnderlyingClick={onUnderlyingClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const init = () => {
    ReactDOM.render(
        <Markets />,
        getElementById('underlying_component')
    );
};

export default init;
