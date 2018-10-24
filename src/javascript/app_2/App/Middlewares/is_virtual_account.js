import Client from '_common/base/client_base';

export const isVirtualAccount = () => !Client.isLoggedIn() || Client.get('is_virtual');
