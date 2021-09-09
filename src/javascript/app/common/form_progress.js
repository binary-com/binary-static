const getElementById = require('../../_common/common_functions').getElementById;
const isMobile = require('../../_common/os_detect').isMobile;
const localize = require('../../_common/localize').localize;

const FormProgress = (() => {
    const render = (identifire, steps, current_step) => {
        const el_header = document.createElement('div');
        el_header.className = 'form-progress__header';

        if (isMobile()) {
            const el_title = document.createElement('p');
            el_title.className = 'form-progress__step-title';
            el_title.innerHTML = localize('Step [_1]: [_2] ([_1] of [_3])',
                [current_step + 1, steps[current_step].title, steps.length]);
            el_header.appendChild(el_title);
        } else {
            const el_steps = document.createElement('div');
            el_steps.className = 'form-progress__steps';

            const el_steps_before = document.createElement('div');
            el_steps_before.className = 'form-progress__steps--before';
            el_steps_before.style.width = `calc(100% * ${steps.length - 1} / ${steps.length})`;
            el_steps.appendChild(el_steps_before);

            steps.forEach((step, index) => {
                const el_step = document.createElement('div');
                el_step.key = index + 1;
                el_step.className = 'form-progress__step';
                el_step.style =  `--step_width: ${steps.length > 4 ? '160px' : '230px'}`;

                const el_identifier = document.createElement('div');
                el_identifier.className = `identifier${index <= current_step ? ' identifier--active' : ''}`;
                el_identifier.innerHTML = index + 1;
                el_step.appendChild(el_identifier);

                const el_title = document.createElement('p');
                el_title.className = 'form-progress__step-title';
                el_title.innerHTML = step.title;
                el_step.appendChild(el_title);
                el_steps.appendChild(el_step);
            });
            const el_steps_after = document.createElement('div');
            el_steps_after.className = 'form-progress__steps--after';
            el_steps_after.style.width = `calc(${current_step / steps.length} * 100%)`;
            el_steps.appendChild(el_steps_after);
            el_header.appendChild(el_steps);
        }
        getElementById(identifire).childNodes.forEach(node => node.parentNode.removeChild(node));
        getElementById(identifire).appendChild(el_header);
    };

    return {
        render,
    };
})();

module.exports = FormProgress;

