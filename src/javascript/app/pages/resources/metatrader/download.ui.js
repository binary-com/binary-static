import OSDetect from '../../../../../templates/_common/os_detect';

const toggleDownloadPage = target => {
    document.querySelectorAll('.download-block').forEach(block => {
        if (block.getAttribute('id') === target) {
            block.classList.add('visible');
            block.classList.remove('invisible');
        } else {
            block.classList.remove('visible');
            block.classList.add('invisible');
        }
    });
    document.querySelectorAll('.download-heading').forEach(heading => {
        if (heading.getAttribute('id') === `${target}-heading`) {
            heading.classList.add('visible');
            heading.classList.remove('invisible');
        } else {
            heading.classList.remove('visible');
            heading.classList.add('invisible');
        }
    });
    document.querySelectorAll('.alternative-download-description').forEach(text => {
        if (text.getAttribute('id') === `${target}-alternative-description`) {
            text.classList.add('visible');
            text.classList.remove('invisible');
        } else {
            text.classList.remove('visible');
            text.classList.add('invisible');
        }
    });
};
const DownloadMetatrader = (() => {
    const onLoad = () => {
        const os = OSDetect();

        // Hide or show a default Item based on navigator.platform
        toggleDownloadPage(os);

        // Listen for custom OS change requests
        document.querySelectorAll('a[data-type=alt-link]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                toggleDownloadPage(e.target.getAttribute('data-target'));
            });
        });
    };

    return {
        onLoad,
    };
})();

module.exports = DownloadMetatrader;
