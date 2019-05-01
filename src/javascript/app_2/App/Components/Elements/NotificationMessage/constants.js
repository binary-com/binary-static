export const default_delay = 3000;

export const max_display_notifications = 3;

export const types = {
    danger : 'notification--danger',
    info   : 'notification--info',
    success: 'notification--success',
    warning: 'notification--warning',
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
