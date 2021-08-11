const environment = process.env.NODE_ENV || 'dev';
const envSet = require(`./env.${environment}.js`)
//const bodyParser = require("body-parser");
//const session = require("express-session");
/*
import NuxtConfiguration from "@nuxt/config";
import bodyParser from "body-parser";
import session from "express-session";

const config: NuxtConfiguration = {
  serverMiddleware: [
    // body-parser middleware
    bodyParser.json(),
    // session middleware
    session({
      secret: "super-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }
    }),
    // Api middleware
    "~/api"
  ],
}*/

module.exports = {
  mode: 'universal',
  env: {
    envSet
  },
  //server: {
    //port: 80,
    // host: 'localhost',
    // host: 'laravel-project.hatake.test',
    //host: '0.0.0.0'
  //},
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/axios/index',
    '@/plugins/element-ui',
    //{ src: '~plugins/localStorage', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/axios', 
     {browserBaseURL: process.env.BASE_APP_URL || '/'}],
     '@nuxtjs/auth',
    ['cookie-universal-nuxt', {parseJSON: false}],
    /*['nuxt-vuex-localstorage', {
      localStorage: ['index'],
    }]*/
  ],
  serverMiddleware: [
    /*
    // body-parser middleware
    bodyParser.json(),
    // session middleware
    session({
      secret: "super-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }
    }),*/
    // Api middleware
    "~/api"
  ],
  /*
  auth: {
    redirect: {
      login: '/login',   // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
      logout: '/login',  // ログアウト時のリダイレクトURL
      callback: false,   // Oauth認証等で必要となる コールバックルート
      home: '/',         // ログイン後のリダイレクトURL
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/www/api/login', method: 'post', propertyName: false },
          logout: { url: '/www/api/logout', method: 'post' },
          user: { url: '/www/api/user', method: 'get', propertyName: false},
        },
      }
    }
  },*/
  router: {
    middleware: ['authed'],
    //middleware: ['auth'],
    //middleware: ['authenticated'],
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
