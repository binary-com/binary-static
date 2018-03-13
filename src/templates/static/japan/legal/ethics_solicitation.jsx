import React from 'react';
import ListMultiLine from '../../../_common/components/list_multiline.jsx';

const EthicsSolicitation = () => (
    <div className='gr-12 gr-padding-30 gr-no-gutter'>
        <h2>{it.L('Investment Solicitation Policy')}</h2>
        <p>{it.L('Japan website Investment Solicitation Policy Paragraph 1')}</p>

        <ListMultiLine
            items={[
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 1'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 1') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 2'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 2') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 3'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 3') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 4'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 4') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 5'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 5') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 6'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 6') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 7'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 7') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 8'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 8') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 9'),  texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 9') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 10'), texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 10') }] },
                { header: it.L('Japan website Investment Solicitation Policy Bold list item 11'), texts: [ { text: it.L('Japan website Investment Solicitation Policy Explanation of item 11') }] },
            ]}
        />
    </div>
);

export default EthicsSolicitation;
