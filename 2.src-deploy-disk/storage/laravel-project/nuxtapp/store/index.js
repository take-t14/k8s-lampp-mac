/*
export const state = () => ({
  csrfToken: null
})

export const mutations = {
 SET_CSRF_TOKEN (state, token) {
   state.csrfToken = token
 },
}

export const actions = {*/
  /*
  async nuxtServerInit ({commit}, { app, req }) {
    console.log('nuxtServerInit' + req)
    var token = {'token': req.csrfToken()}
    var res = {}
    try {
        res = await app.$axios.get("http://laravel-project.hatake.test/www/api/get")
        console.log(res)
        token.token = res.data[3]["key1"]
        token.cookies = res.headers['set-cookie']
    } catch (e) {
        console.log(e)
        res = e.response
    }
    if (req.cookies) {
      console.log('SET_CSRF_TOKEN : ' + token)
      commit('SET_CSRF_TOKEN', token)
    }
  },*//*
  setCsrfToken(ctx, token) {
    ctx.commit('SET_CSRF_TOKEN', token)
  }
}*/

import { axios } from "~/plugins/axios/index.js";
// ****************************************************
// * STATE
// ****************************************************
export const state = () => ({
    csrfToken: null
  , authUser: null
});

// ****************************************************
// * MUTATIONS
// ****************************************************
export const mutations = {
  SET_USER (state, user) {
    console.log("SET_USER")
    console.log(user)
    state.authUser = user
  },
  SET_CSRF_TOKEN (state, token) {
    state.csrfToken = token
  },
 };

// ****************************************************
// * ACTIONS
// ****************************************************
export const actions = {
  async nuxtServerInit(ctx, req) {
    console.log("nuxtServerInit")
    if (process.env.GENERATE === '1') {
      return
    }
    // セッションがあれば、storeに詰める
    console.log(req.ssrContext.req.session)
    if (req.ssrContext.req.session && req.ssrContext.req.session.authUser) {
      ctx.commit("SET_USER", req.ssrContext.req.session.authUser);
    }
    /*
    if (req.cookies) {
      console.log("req.cookies")
      console.log(req.csrfToken())
      ctx.commit("SET_CSRF_TOKEN", req.csrfToken())
    }*/
  },

  async login(ctx, user) {
    // console.log(user)
    // laravelのログイン呼び出し
    const data = await axios.post("/www/api/login", user)
    // serverMiddlewareを呼び出してセッションに保存
    const data2 = await axios.post("/api/login", {authUser: data.data})
    console.log("SET_USER")
    console.log(data.data)
    ctx.commit("SET_USER", data.data);
    if (false !== ctx.state.authUser && $nuxt.$route.path !== "/"){
      window.location.href = "/";
    }
  },

  async logout(ctx) {
    // laravelのログアウト呼び出し
    const data = await axios.post("/www/api/logout")
    // serverMiddlewareを呼び出してセッションを削除
    await axios.post("/api/logout");
    ctx.commit("SET_USER", null);
    if (null === ctx.state.authUser && $nuxt.$route.path !== "/login"){
      window.location.href = "/login";
    }
  },
  setCsrfToken(ctx, token) {
    ctx.commit('SET_CSRF_TOKEN', token)
  }
};