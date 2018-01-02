import React from 'react';

const Title = () => {
    const browser_title = it.title ? `${it.L(it.title)} | ` : '';
    const is_ja = it.language.toLowerCase() === 'ja';
    const title = `${browser_title}${is_ja ? it.L('{JAPAN ONLY}Binary.com page title') : it.website_name}`;
    return (
        <title>{title}</title>
    );
};

export default Title;
