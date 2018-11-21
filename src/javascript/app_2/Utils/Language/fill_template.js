import React from 'react';

export const fillTemplate = (template, replacers) => {
    const res       = [];
    let str         = template;
    let open_tag_id = null;

    while (str.length) {
        const match = str.match(/\[_(\d+)\]/);

        if (!match) {
            res.push(str);
            break;
        }

        const {
            0: tag,
            1: tag_id,
            index,
        } = match;

        const before = str.slice(0, index);
        str = str.slice(index + tag.length);

        if (open_tag_id) {
            const pair_code = `${open_tag_id}_${tag_id}`;
            const wrapper   = replacers[pair_code];

            if (!React.isValidElement(wrapper)) throw new Error(`Localize: pair tag ${pair_code} must be replaced with a react element.`);
            if (!wrapper) throw new Error(`Localize: no ${open_tag_id} or ${pair_code} replacer for "${template}" template.`);

            res.push(React.cloneElement(wrapper, { key: index, children: before }));
            open_tag_id = null;
        } else {
            if (before.length) res.push(before);

            if (tag_id in replacers) {
                res.push(replacers[tag_id]);
            } else {
                open_tag_id = tag_id;
            }
        }
    }
    if (open_tag_id) throw new Error(`Localize: no ${open_tag_id} replacer for "${template}" template.`);

    // concat adjacent strings in result array
    return res.reduce((arr, current) => {
        const last = arr[arr.length - 1];
        if (typeof last === 'string' && typeof current === 'string') {
            arr[arr.length - 1] = last + current;
        } else {
            arr.push(current);
        }
        return arr;
    }, []);
};
