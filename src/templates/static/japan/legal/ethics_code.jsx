import React from 'react';
import ListMultiLine from '../../../_common/components/list_multiline.jsx';

const EthicsCode = () => (
    <div className='gr-12 gr-padding-30 gr-no-gutter'>
        <h2>{it.L('Ethics Code')}</h2>
        <p>{it.L('Japan website Ethics Code Paragraph 1')}</p>
        <p>{it.L('Japan website Ethics Code Paragraph 2')}</p>
        <p>{it.L('Japan website Ethics Code Paragraph 3')}</p>
        <ListMultiLine
            items={[
                { header: it.L('Japan website Ethics Code Bold list item 1'), texts: [{ text: it.L('Japan website Ethics Code Explanation of item 1') }] },
                { header: it.L('Japan website Ethics Code Bold list item 2'), texts: [{ text: it.L('Japan website Ethics Code Explanation of item 2') }] },
                { header: it.L('Japan website Ethics Code Bold list item 3'), texts: [{ text: it.L('Japan website Ethics Code Explanation of item 3') }] },
                { header: it.L('Japan website Ethics Code Bold list item 4'), texts: [{ text: it.L('Japan website Ethics Code Explanation of item 4') }] },
                { header: it.L('Japan website Ethics Code Bold list item 5'), texts: [{ text: it.L('Japan website Ethics Code Explanation of item 5') }] },
                {
                    header: it.L('Japan website Ethics Code Bold list item 6'),
                    texts : [
                        { text: it.L('Japan website Ethics Code Explanation of item 6.1') },
                        { text: it.L('Japan website Ethics Code Explanation of item 6.2') },
                        { text: it.L('Japan website Ethics Code Explanation of item 6.3') },
                    ],
                },
                {
                    header: it.L('Japan website Ethics Code Bold list item 7'),
                    texts : [
                        { text: it.L('Japan website Ethics Code Explanation of item 7.1') },
                        { text: it.L('Japan website Ethics Code Explanation of item 7.2') },
                    ],
                },
                {
                    header: it.L('Japan website Ethics Code Bold list item 8'),
                    texts : [
                        { text: it.L('Japan website Ethics Code Explanation of item 8.1') },
                        { text: it.L('Japan website Ethics Code Explanation of item 8.2') },
                    ],
                },
                {
                    header: it.L('Japan website Ethics Code Bold list item 9'),
                    texts : [
                        { text: it.L('Japan website Ethics Code Explanation of item 9.1') },
                        { text: it.L('Japan website Ethics Code Explanation of item 9.2') },
                    ],
                },
            ]}
        />
    </div>
);

export default EthicsCode;
