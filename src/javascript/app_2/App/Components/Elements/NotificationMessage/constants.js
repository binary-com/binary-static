export const DEFAULT_DELAY = 3000;

export const MAX_DISPLAY_NOTIFICATIONS = 3;

export const TYPES = {
    DANGER : 'notification--danger',
    INFO   : 'notification--info',
    SUCCESS: 'notification--success',
    WARNING: 'notification--warning',
};

export const sortNotifications = (() => {
    const notification_order = {
        danger : 1,
        warning: 2,
        info   : 3,
        success: 4,
    };

    return (a, b) => notification_order[a.type] - notification_order[b.type];
})();
