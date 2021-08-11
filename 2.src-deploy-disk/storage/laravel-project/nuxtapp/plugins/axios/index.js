export let axios;

export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    console.log("$axios.onRequest")
    /*
    if (store.state.csrfToken) {
      console.log("store.state.csrfToken")
      console.log(store.state.csrfToken)
      //$axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN'
      //$axios.defaults.withCredentials = true
      //config.headers.common['X-CSRF-TOKEN'] = store.state.csrfToken.token
      //config.headers.common['cookie'] = store.state.csrfToken.cookies.join('; ')
      config.headers.common['X-CSRF-TOKEN'] = store.state.csrfToken
    }*/
    config.headers.common['Authorization'] = `Bearer token`;
    config.headers.common['Accept'] = 'application/json';

    console.log(config)
    return config
  })

  $axios.onResponse((response) => {
    console.log("$axios.onResponse")
    /*
    var token = {}
    token.token = response.data["csrf-token"]
    token.cookies = response.headers['set-cookie']
    console.log(token)
    store.dispatch("setCsrfToken", token)
*/
    console.log(response)
    return Promise.resolve(response);
  })

  $axios.onError(error => {
    return Promise.reject(error.response);
  });

  axios = $axios;
}
