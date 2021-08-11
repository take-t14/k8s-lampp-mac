<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        nuxtapp
      </h1>
      <h2 class="subtitle">
        My fabulous Nuxt.js project
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>

    <div>
      <div>{{ user('name') }}</div>
      <div>{{ user('email') }}</div>
      <button @click="logout">ログアウト</button>
    </div>

    <example-component :data="getData"></example-component>

    <button @click="onGetData">データ取得</button>
    <input type="text" name="name" v-model="name">
    <button @click="csrfTokenTest">CSRFトークンテスト</button>
    <div>{{ csrfTestRes }}</div>

  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import ExampleComponent from '~/components/ExampleComponent.vue'
//import axios from 'axios'
import setCookie from 'set-cookie-parser'
//import Cookies from 'universal-cookie'
import {ClientCookies, SSRCookies} from '~/services/cookies';
export default {
  /*
  middleware({ store, redirect }) {
    if(!store.$auth.loggedIn) {
      redirect('/login');
    }
  },*/
  //middleware: 'authenticated',
  components: {
    Logo, ExampleComponent
  },
  data() {
    return {
      getData: [],
      csrfTestRes: {},
      name: "",
    }
  },
  async asyncData ({ app, store, req, error }) {
    try {
      console.log("asyncData")
      console.log(req.headers)
      const res = await app.$axios.get("http://apache-sv/www/api/get")
      var cookieDatas = setCookie.parse(res, {
        decodeValues: true  // default: true
      });
      console.log("cookie")
      const cookies = process.server ? SSRCookies(app) : ClientCookies();
      for (var idx in cookieDatas) {
        console.log(cookieDatas[idx])
        cookies.set(cookieDatas[idx].name, cookieDatas[idx].value, {
          path: cookieDatas[idx].path,
          maxAge: cookieDatas[idx].maxAge,
          expires: cookieDatas[idx].expires
        })
      }
      return { getData: res.data }
    } catch(e) {
      console.log(store.state.csrfToken)
      console.log(e)
      error({ statusCode: 404, message: 'ページが見つかりません' })
    }
  },
  methods: {
    user(idx = null) {
      if(undefined === this.$store.state.authUser|| null === this.$store.state.authUser) {
        return ""
      }
      if(null !== idx && !this.$store.state.authUser[idx]) {
        return ""
      }
      return null !== idx ? this.$store.state.authUser[idx] : this.$store.state.authUser
    },
    logout() {
      //this.$auth.logout();
      this.$store.dispatch("logout")
    },
    onGetData() {
        console.log("onGetData")
        this.$axios.get("http://laravel-project.hatake.test/www/api/get")
        .then((res) => {
            console.log(res)
            this.getData = res.data
        })
        .catch((e) => {
            console.log(e)
        })
    },
    csrfTokenTest() {
      console.log(this.name)
      this.$axios.post("http://laravel-project.hatake.test/www/api/csrf-test", {name: this.name})
        .then((res) => {
          console.log(res)
          //this.csrfTestRes = res
        })
        .catch((e) => {
          console.log(e)
          //this.csrfTestRes = e
        })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
