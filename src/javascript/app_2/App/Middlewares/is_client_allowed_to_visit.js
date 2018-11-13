import Client from '_common/base/client_base';

export const isClientAllowedToVisit = () => !Client.isLoggedIn() || Client.get('is_virtual') ||
    Client.get('landing_company_shortcode') === 'costarica';
