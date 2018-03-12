import React from 'react';

const LiP = ({ children, header, id, paragraphs }) => (
    <li id={id} className='gr-padding-10'>
        <strong>{header}</strong>
        { paragraphs.map((p, idx) =>(
            <p key={idx}>{p}</p>
        ))}
        {children}
    </li>
);

const Affiliates = () => (
    <div id='affiliate-tnc-jp' className='gr-12 gr-padding-30 gr-no-gutter'>
        <h2>{it.L('{JAPAN ONLY} Affiliate Program Terms & Conditions')}</h2>

        <ol>
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 1 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 1 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 1 Paragraph 2'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 2 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 2 Paragraph 1. [_1]Link to binary_affiliate_guidelines.pdf[_2].', `<a href="${it.japan_docs_url}/documents/binary_affiliate_guidelines.pdf" target="_blank">`, '</a>'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 2 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 2 Paragraph 3'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 3 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 3 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 3 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 3 Paragraph 3'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 3 Paragraph 4'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 3'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 4'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 5'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 6'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 7'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 8'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 9'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 4 Paragraph 10'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Paragraph 3'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Paragraph 4'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Paragraph 5'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Paragraph 6'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 5 Paragraph 7'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 6 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 6 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 6 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 6 Paragraph 3'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 7 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 7 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 7 Paragraph 2'),
                ]}
            />
            <LiP id='section-8' header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Title')} paragraphs={[it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 1')]}>
                <ul className='gr-padding-10'>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 2')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 3')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 4')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 5')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 6')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7')}</li>
                    <ul>
                        <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7 Point A')}</li>
                        <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7 Point B')}</li>
                        <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7 Point C')}</li>
                        <ul>
                            <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7 Point C Sub 1')}</li>
                            <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7 Point C Sub 2(1)')}</li>
                            <ul>
                                <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7 Point C Sub 2(2)')}</li>
                                <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 7 Point C Sub 2(3)')}</li>
                            </ul>
                        </ul>
                    </ul>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 8')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 1 Line 9')}</li>
                </ul>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 2')}</p>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 3')}</p>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 4')}</p>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 5')}</p>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 8 Paragraph 6')}</p>
            </LiP>
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 9 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 9 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 9 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 9 Paragraph 3'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 10 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 10 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 10 Paragraph 2'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 11 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 11 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 11 Paragraph 2'),
                ]}
            />
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 3'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 4 Line 1'),
                ]}
            >
                <ul>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 4 Line 2')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 4 Line 3')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 4 Line 4')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 4 Line 5')}</li>
                </ul>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 12 Paragraph 5')}</p>
            </LiP>
            <LiP header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Title')} paragraphs={[it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1')]} >
                <ul>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 1')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 2')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 3')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 4')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 5')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 6')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 7')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 8')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 9')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 1 Sub 10')}</li>
                </ul>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 2')}</p>
                <ul>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 2 Sub 1')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 2 Sub 2')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 2 Sub 3')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 2 Sub 4')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 2 Sub 5')}</li>
                </ul>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 3')}</p>
                <ul>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 3 Sub 1')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 3 Sub 2')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 3 Sub 3')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 3 Sub 4')}</li>
                    <li>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 3 Sub 5')}</li>
                </ul>
                <p>{it.L('{JAPAN ONLY} Affiliate Program T&C Section 13 Paragraph 4')}</p>
            </LiP>
            <LiP
                header={it.L('{JAPAN ONLY} Affiliate Program T&C Section 14 Title')}
                paragraphs={[
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 14 Paragraph 1'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 14 Paragraph 2'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 14 Paragraph 3'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 14 Paragraph 4'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 14 Paragraph 5'),
                    it.L('{JAPAN ONLY} Affiliate Program T&C Section 14 Paragraph 6'),
                ]}
            />
        </ol>

        <span style={{float: 'right'}}>{it.L('{JAPAN ONLY} Affiliate Program T&C Section Version Update')}</span>
    </div>
);

export default Affiliates;
