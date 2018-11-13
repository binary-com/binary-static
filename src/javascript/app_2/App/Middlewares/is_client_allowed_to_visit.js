import Client from '_common/base/client_base';

export const isClientAllowedToVisit = () => !Client.isLoggedIn() || Client.get('is_virtual') ||
    /^CR/.test(Client.get('loginid'));
