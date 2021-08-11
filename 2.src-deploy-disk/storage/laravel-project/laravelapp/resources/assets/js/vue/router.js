import Vue from 'vue';
import VueRouter from 'vue-router';
import Test from './components/Test';
import Home from './components/Home';
import Packages from './components/Packages';

Vue.use(VueRouter);

const routes = [
    { path: '/www/vue/test/', name: 'test', component: Test },
    { path: '/www/vue/', name: 'home', component: Home },
    { path: '/www/vue/packages/:type', name: 'packages', component: Packages },
];

export default new VueRouter({
    mode: 'history',
    routes,
});
