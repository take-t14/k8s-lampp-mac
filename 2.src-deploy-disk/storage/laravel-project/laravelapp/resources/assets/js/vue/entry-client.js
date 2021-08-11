import app from './app';

var pcg = window.packages
pcg.process = "client"
app.$store.commit('setPackages', { packages: pcg });

app.$mount('#app');
