import { OSDetect, isDesktop } from '../../../../_common/os_detect';
import { getElementById } from '../../../../_common/common_functions';

const toggleDownloadPage = target => {
    if (isDesktop()) {
        document.querySelectorAll('.download-block').forEach(block => {
            block.setVisibility(block.getAttribute('id') === target);
        });
        document.querySelectorAll('.download-heading').forEach(heading => {
            heading.setVisibility(heading.getAttribute('id') === `${target}-heading`);
        });
        document.querySelectorAll('.alternative-download-description').forEach(text => {
            text.setVisibility(text.getAttribute('id') === `${target}-alternative-description`);
        });
    } else {
        document.querySelectorAll('.mobile-alternative-download-description')
            .forEach(text => {
                text.setVisibility(text.getAttribute('id') === `${target}-alternative-description`);
            });
        document.querySelectorAll('.desktop-apps').forEach(el => el.setVisibility(0));
        document.querySelector('#mobile-apps')
            .childNodes
            .forEach(child => child.setVisibility(0));
        getElementById(`${target}-app`).setVisibility(1);
        getElementById(`${target}-heading`).setVisibility(1);
        getElementById(`${target}-description`).setVisibility(1);
    }
    getElementById(`mt5_download_${target === 'mac' ? 'mac_' : ''}platforms`).setVisibility(1);
    getElementById(`mt5_download_${target !== 'mac' ? 'mac_' : ''}platforms`).setVisibility(0);

};
const DownloadMetatrader = (() => {
    const onLoad = () => {
        const os = OSDetect();

        // Hide or show a default item based on navigator.platform
        toggleDownloadPage(os);

        // Listen for custom OS change requests
        document.querySelectorAll('a[data-type=alt-link]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                toggleDownloadPage(e.target.getAttribute('data-target'));
            });
        });

        // Listen for mobile custom OS change request
        document.querySelectorAll('#mobile-alt')
            .forEach(link => {
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
