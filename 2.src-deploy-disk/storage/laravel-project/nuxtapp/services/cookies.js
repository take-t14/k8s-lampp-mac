import Cookies from 'universal-cookie';
const ClientCookies = () => new Cookies();
const SSRCookies = app => app.$cookies;
export {ClientCookies, SSRCookies};
