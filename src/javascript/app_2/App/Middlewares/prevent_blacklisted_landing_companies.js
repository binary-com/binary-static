import Client                      from '_common/base/client_base';

export default () => Client.hasCostaricaAccount() || (Client.getAccountType() === 'virtual');
