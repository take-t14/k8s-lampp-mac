/* global context, dispatch */

import app from './app';
import renderVueComponentToString from 'vue-server-renderer/basic';

app.$router.push(context.url);

var pcg = context.packages
pcg.process = "server"
app.$store.commit('setPackages', { packages: pcg });

renderVueComponentToString(app, (err, html) => {
    if (err) {
        throw new Error(err);
    }
    dispatch(html);
});
