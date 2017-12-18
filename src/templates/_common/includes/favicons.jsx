/* eslint-disable no-unneeded-ternary */
import React from 'react'; // eslint-disable-line

const Link = ({ // eslint-disable-line
    favicons,
}) => favicons.map((fav, idx) => {
    const sizes = `${fav.size}x${fav.size}`;
    const rel = fav.is_image ? 'icon' : 'apple-touch-icon';
    const url = `images/favicons/${fav.is_image ? 'fav' : 'apple-touch-'}icon-${sizes}.png`;

    return (
        <link
            key={idx}
            rel={rel ? rel : undefined} sizes={sizes}
            type={fav.is_image && 'image/png' || undefined}
            href={it.url_for(url)}
        />
    );
});

const Favicons = () => (
    <Link
        favicons={[
            { size: '57' },
            { size: '114' },
            { size: '72' },
            { size: '144' },
            { size: '60' },
            { size: '120' },
            { size: '76' },
            { size: '152' },
            { size: '180' },
            { is_image: 1, size: '192' },
            { is_image: 1, size: '160' },
            { is_image: 1, size: '96' },
            { is_image: 1, size: '16' },
            { is_image: 1, size: '32' },
        ]}
    />
);

export default Favicons;
