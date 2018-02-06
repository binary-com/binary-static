import React from 'react';

const Trading = () => (
    <div id='trading_2' className='mdc-layout-grid'>
        <div className='mdc-layout-grid__inner'>
            <div className='mdc-layout-grid__cell mdc-layout-grid__cell--span-9 mdc-layout-grid__cell--span-12-tablet mdc-layout-grid__cell--span-12-phone'>
            </div>
            <div className='mdc-layout-grid__cell mdc-layout-grid__cell--span-3 mdc-layout-grid__cell--span-12-tablet mdc-layout-grid__cell--span-12-phone'>
                <div className='mdc-elevation--z2 btn sm-down hide'>
                    <div className='mdc-select full-width date-start' role='listbox' tabIndex='0'>
                        <span className='mdc-select__selected-text'>Now</span>
                        <div className='mdc-simple-menu mdc-select__menu'>
                            <ul className='mdc-list mdc-simple-menu__items'>
                                <li className='mdc-list-item' role='option' id='now' tabIndex='0'>
                                    Now
                                </li>
                                <li className='mdc-list-item' role='option' id='tomorrow' tabIndex='0'>
                                    Tomorrow
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='mdc-elevation--z2 btn sm-down hide'>
                    <div className='mdc-select full-width expiry' role='listbox' tabIndex='0'>
                        <span className='mdc-select__selected-text'>Duration</span>
                        <div className='mdc-simple-menu mdc-select__menu'>
                            <ul className='mdc-list mdc-simple-menu__items'>
                                <li className='mdc-list-item' role='option' id='duration' tabIndex='0'>
                                    Duration
                                </li>
                                <li className='mdc-list-item' role='option' id='end-time' tabIndex='0'>
                                    End Time
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='duration-selector'>
                        <div className='duration-input'>
                            <div className='mdc-text-field text duration-value'>
                                <input type='number' id='duration_value' className='mdc-text-field__input' min={1} placeholder='1' defaultValue='1'/>
                                <div className='mdc-text-field__bottom-line line'></div>
                            </div>
                            <p className='mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg'>
                                The minimum duration is 1 day
                            </p>
                        </div>
                        <div className='duration-type right'>
                            <div id='duration_unit' className='mdc-select duration-unit' role='listbox' tabIndex='0'>
                                <span className='mdc-select__selected-text'>Day</span>
                                <div className='mdc-simple-menu mdc-select__menu'>
                                    <ul className='mdc-list mdc-simple-menu__items'>
                                        <li className='mdc-list-item' role='option' id='day' tabIndex='0'>
                                            Day
                                        </li>
                                        <li className='mdc-list-item' role='option' id='ticks' tabIndex='0'>
                                            Ticks
                                        </li>
                                        <li className='mdc-list-item' role='option' id='minutes' tabIndex='0'>
                                            Minutes
                                        </li>
                                        <li className='mdc-list-item' role='option' id='hours' tabIndex='0'>
                                            Hours
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mdc-elevation--z2 btn sm-down hide'>
                    <div className='duration-selector'>
                        <div className='duration-type left'>
                            <div id='amount_type' className='mdc-select amount-type' role='listbox' tabIndex='0'>
                                <span className='mdc-select__selected-text'>Payout</span>
                                <div className='mdc-simple-menu mdc-select__menu'>
                                    <ul className='mdc-list mdc-simple-menu__items'>
                                        <li className='mdc-list-item' role='option' aria-selected id='payout' tabIndex='0'>
                                            Payout
                                        </li>
                                        <li className='mdc-list-item' role='option' id='stake' tabIndex='0'>
                                            Stake
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='duration-input'>
                            <div className='mdc-text-field text amount-value'>
                                <i className='material-icons mdc-text-field__icon' tabIndex='0'>attach_money</i>
                                <input type='number' id='amount_value' className='mdc-text-field__input' placeholder='5000' defaultValue='5000'/>
                                <div className='mdc-text-field__bottom-line line'></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='modal-popup-1' className='mdc-elevation--z4 btn modal sm-up hide'>
                    <p><span>Top Widget</span></p>
                </div>
                <div id='modal-popup-2' className='mdc-elevation--z4 btn modal sm-up hide'>
                    <p><span>Bottom Widget</span></p>
                </div>
                <div className='mdc-elevation--z2 btn small sm-down hide'>
                    <div className='contract-market-container'>
                        <div className='price-container'>
                            <div className='first-column'>
                                <div className='box'>
                                    <div>
                                        <p>Return:</p>
                                        <p className='return-text'>78.8%</p>
                                    </div>
                                    <div className='box-end'>
                                        <p>Net Profit:</p>
                                        <p className='profit-text'>$220.39</p>
                                    </div>
                                </div>
                            </div>
                            <div className='second-column'>
                                <div className='box'>
                                    <div>
                                        <p>Stake:</p>
                                        <p className='negative-text'>279.61</p>
                                    </div>
                                    <div className='box-end'>
                                        <p>Payout:</p>
                                        <p className='payout-text'>500.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className='third-column'>
                                <button className='mdc-button mdc-button--unelevated'>
                                    <i className='material-icons mdc-button__icon btn-icon'>trending_up</i>
                                    rise
                                </button>
                            </div>
                        </div>
                        <hr/>
                        <div className='price-container'>
                            <div className='first-column'>
                                <div className='box'>
                                    <div>
                                        <p>Return:</p>
                                        <p className='return-text'>78.8%</p>
                                    </div>
                                    <div className='box-end'>
                                        <p>Net Profit:</p>
                                        <p className='profit-text'>220.39</p>
                                    </div>
                                </div>
                            </div>
                            <div className='second-column'>
                                <div className='box'>
                                    <div>
                                        <p>Stake:</p>
                                        <p className='positive-text'>260.36</p>
                                    </div>
                                    <div className='box-end'>
                                        <p>Payout:</p>
                                        <p className='payout-text'>500.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className='third-column'>
                                <button className='mdc-button mdc-button--unelevated'>
                                    <i className='material-icons mdc-button__icon btn-icon'>trending_down</i>
                                    fall
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <aside id='modal-1' className='mdc-dialog' role='alertdialog' aria-labelledby='mdc-dialog-with-list-label' aria-describedby='mdc-dialog-with-list-description'>
            <div className='mdc-dialog__surface set-height full set-width full'>
                <header className='mdc-dialog__header'>
                    <h2 id='mdc-dialog-with-list-label' className='mdc-dialog__header__title'>Select Ipsum/Lorem</h2>
                </header>
                <section id='mdc-dialog-with-list-description'
                         className='mdc-dialog__body mdc-dialog__body--scrollable set-height max-eighty'>
                    <ul className='mdc-list'>
                        <li className='mdc-list-item'>
                            <select className='mdc-select full-width'>
                                <option value='' selected>Select Lorem</option>
                                <option value='lorem'>lorem</option>
                                <option value='ipsum'>ipsum</option>
                                <option value='lorem'>lorem</option>
                                <option value='ipsum'>ipsum</option>
                                <option value='lorem'>lorem</option>
                                <option value='ipsum'>ipsum</option>
                            </select>
                        </li>
                        <li className='mdc-list-item'>
                            <label className='mdc-text-field text full-width'>
                                <input type='text' className='mdc-text-field__input'/>
                                <span className='mdc-text-field__label'>Hint Text</span>
                                <div className='mdc-text-field__bottom-line'></div>
                            </label>
                        </li>
                        <li className='mdc-list-item'>
                            <label className='mdc-text-field amount full-width'>
                                <input type='date' className='mdc-text-field__input'/>
                                <div className='mdc-text-field__bottom-line'></div>
                            </label>
                        </li>
                    </ul>
                </section>
                <footer className='mdc-dialog__footer'>
                    <button type='button'
                            className='mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel'>Discard
                    </button>
                    <button type='button'
                            className='mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept'>Confirm
                    </button>
                </footer>
            </div>
            <div className='mdc-dialog__backdrop'></div>
        </aside>
        <aside id='modal-2' className='mdc-dialog' role='alertdialog' aria-labelledby='mdc-dialog-with-list-label' aria-describedby='mdc-dialog-with-list-description'>
            <div className='mdc-dialog__surface set-height full set-width full'>
                <header className='mdc-dialog__header'>
                    <h2 id='mdc-dialog-with-list-label' className='mdc-dialog__header__title'>Select Ipsum/Lorem</h2>
                </header>
                <section id='mdc-dialog-with-list-description' className='mdc-dialog__body mdc-dialog__body--scrollable set-height max-eighty'>
                    <ul className='mdc-list'>
                        <li className='mdc-list-item'>
                            <select className='mdc-select full-width'>
                                <option value='' selected>Select Lorem</option>
                                <option value='lorem'>lorem</option>
                                <option value='ipsum'>ipsum</option>
                                <option value='lorem'>lorem</option>
                                <option value='ipsum'>ipsum</option>
                                <option value='lorem'>lorem</option>
                                <option value='ipsum'>ipsum</option>
                            </select>
                        </li>
                        <li className='mdc-list-item'>
                            <label className='mdc-text-field text full-width'>
                                <input type='text' className='mdc-text-field__input'/>
                                <span className='mdc-text-field__label'>Hint Text</span>
                                <div className='mdc-text-field__bottom-line'></div>
                            </label>
                        </li>
                        <li className='mdc-list-item'>
                            <label className='mdc-text-field amount full-width'>
                                <input type='date' className='mdc-text-field__input'/>
                                <div className='mdc-text-field__bottom-line'></div>
                            </label>
                        </li>
                    </ul>
                </section>
                <footer className='mdc-dialog__footer'>
                    <button type='button' className='mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel'>Discard</button>
                    <button type='button' className='mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept'>Confirm</button>
                </footer>
            </div>
            <div className='mdc-dialog__backdrop'></div>
        </aside>
    </div>
);

export default Trading;
