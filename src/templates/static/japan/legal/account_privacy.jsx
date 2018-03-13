import React from 'react';
import ListMultiline from '../../../_common/components/list_multiline.jsx';

const AccountPrivacy = () => {
    const items = [
        { header: it.L('Japan website Privacy Policy Bold list item 1'), texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 1') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 2'), texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 2') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 3'), texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 3') }] },
        {
            header  : it.L('Japan website Privacy Policy Bold list item 4'),
            ul      : 1,
            ul_class: 'bullet',
            li_class: 'gr-padding-10',
            texts   : [
                { li: it.L('Japan website Privacy Policy List item 4.1') },
                { li: it.L('Japan website Privacy Policy List item 4.2') },
                { li: it.L('Japan website Privacy Policy List item 4.3') },
                { li: it.L('Japan website Privacy Policy List item 4.4') },
                { li: it.L('Japan website Privacy Policy List item 4.5') },
                { li: it.L('Japan website Privacy Policy List item 4.6') },
                { li: it.L('Japan website Privacy Policy List item 4.7') },
                { li: it.L('Japan website Privacy Policy List item 4.8') },
                { li: it.L('Japan website Privacy Policy List item 4.9') },
            ]},
        { header: it.L('Japan website Privacy Policy Bold list item 5'),  texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 5') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 6'),  texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 6') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 7'),  texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 7') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 8'),  texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 8') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 9'),  texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 9') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 10'), texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 10') }] },
        { header: it.L('Japan website Privacy Policy Bold list item 11'), texts: [ { text: it.L('Japan website Privacy Policy Explanation of item 11') }] },
        {
            header: it.L('Japan website Privacy Policy Bold list item 12'),
            texts : [
                { text: it.L('Japan website Privacy Policy list item 12 Paragraph 1.1') },
                { text: it.L('Japan website Privacy Policy list item 12 Paragraph 1.2') },
                { text: it.L('Japan website Privacy Policy list item 12 Paragraph 1.3') },
                { text: it.L('Japan website Privacy Policy list item 12 Paragraph 1.4') },
                { text: it.L('Japan website Privacy Policy list item 12 Paragraph 1.5') },
            ],
        },
        {
            header: it.L('Japan website Privacy Policy Bold list item 13'),
            texts : [
                { text: it.L('Japan website Privacy Policy Paragraph list item 13 1.1') },
                { text: it.L('Japan website Privacy Policy Paragraph list item 13 1.2') },
                { text: it.L('Japan website Privacy Policy Paragraph list item 13 1.3') },
                { text: it.L('Japan website Privacy Policy Paragraph list item 13 1.4') },
            ],
        },
    ];

    return (
        <div className='gr-12 gr-padding-30 gr-no-gutter'>
            <h2>{it.L('Privacy Policy')}</h2>
            <p>{it.L('Japan website Privacy Policy Paragraph 1')}</p>
            <ListMultiline items={items} />
        </div>
    );
};

export default AccountPrivacy;
