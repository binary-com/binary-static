import React from 'react';

export const fillTemplate = (template, replacers) => {
    const res = [];
    let str = template;
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
            const wrapper = replacers[pair_code];
            // TODO: throw if wrapper is not a component
            if (!wrapper) throw new Error(`Localize: no ${open_tag_id} or ${pair_code} replacer for "${template}" template.`);
            res.push(
                React.cloneElement(wrapper, { key: index, children: before })
            );
            open_tag_id = null;
        }
        else {
            if (before.length) res.push(before);

            if (replacers.hasOwnProperty(tag_id)) {
                res.push(replacers[tag_id]);
            }
            else {
                open_tag_id = tag_id;
            }
        }
    }
    if (open_tag_id) throw new Error(`Localize: no ${open_tag_id} replacer for "${template}" template.`);
    return res;
};
