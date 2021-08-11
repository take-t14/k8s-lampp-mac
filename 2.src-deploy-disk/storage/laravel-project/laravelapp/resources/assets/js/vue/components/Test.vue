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

    <example-component :data="get"></example-component>

    <button @click="onGetData">データ取得</button>
    <input type="text" name="name" v-model="name">
    <button @click="csrfTokenTest">CSRFトークンテスト</button>
    <div>{{ csrfTest }}</div>

  </div>
</template>

<script>
import Logo from './Logo.vue'
import ExampleComponent from './ExampleComponent.vue'
import axios from 'axios'
export default {
  components: {
    Logo, ExampleComponent
  },
  data() {
    return {
      name: "",
    }
  },
  computed: {
    get() {
        //console.log("get process=" + this.$store.state.packages.process)
        if (!this.$store.state.packages.get) {
            return []
        }
        return this.$store.state.packages.get;
    },
    csrfTest() {
        //console.log("csrfTest process=" + this.$store.state.packages.process)
        if (!this.$store.state.packages.csrfTest) {
            return {}
        }
        return this.$store.state.packages.csrfTest;
    },
  },/*
  async created() {
    this.consoleLog("created process=" + this.$store.state.packages.process)
    await this.onGetData()
    await this.csrfTokenTest()
  },*/
  methods: {
    async onGetData() {
      this.consoleLog("onGetData ->->->->")
      try {
        const res = await axios.get(this.getServerUrl("/www/api/get"))
        this.consoleLog(res)
        var pcg = this.$store.state.packages
        this.$set(pcg, "get", res.data);
        this.$store.commit('setPackages', { packages: pcg });
      } catch(e) {
        this.consoleLog(e)
      }
      this.consoleLog("onGetData <-<-<-<-")
    },
    async csrfTokenTest() {
      this.consoleLog("csrfTokenTest ->->->->")
      this.consoleLog(this.name)
      try {
        const res = await axios.post(this.getServerUrl("/www/api/csrf-test"), {name: this.name})
        this.consoleLog(res)
        var pcg = this.$store.state.packages
        this.$set(pcg, "csrfTest", res.data);
        this.$store.commit('setPackages', { packages: pcg });
      } catch(e) {
        this.consoleLog(e)
      }
      this.consoleLog("csrfTokenTest <-<-<-<-")
    },
    consoleLog(log) {
        if("client" !== this.$store.state.packages.process) return
        console.log(log)
    },
    getServerUrl(addUrl) {
        var strUrl = ""
        if("client" === this.$store.state.packages.process) {
            strUrl = addUrl
        } else {
            strUrl = "http://apache-sv" + addUrl
        }
        this.consoleLog(strUrl)
        return strUrl
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
