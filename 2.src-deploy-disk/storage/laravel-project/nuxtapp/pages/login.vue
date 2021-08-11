<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Login</div>
          <div>
            <div>{{ user('id') }}</div>
            <div>{{ user('email') }}</div>
            <div>{{ user('password') }}</div>
          </div>

          <div class="card-body">
            <el-form :model="form" ref="form">
              <div class="form-group row">
                <el-form-item label="E-Mail Address" prop="email">
                  <el-input id="email" type="email" class="form-control" name="email" v-model="form.email" required autocomplete="email" autofocus></el-input><!-- @error('email') is-invalid @enderror -->
                  <!--
                  @error('email')
                    <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                    </span>
                  @enderror
                   -->
                </el-form-item>
              </div>
              <div class="form-group row">
                <el-form-item label="Password" prop="password">
                  <el-input id="password" type="password" class="form-control" name="password" v-model="form.password" required autocomplete="current-password"></el-input><!-- @error('password') is-invalid @enderror -->
                  <!-- 
                  @error('password')
                    <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                    </span>
                  @enderror
                   -->
                </el-form-item>
              </div>
              <div class="form-group row">
                <el-checkbox class="form-check-input" name="remember" id="remember" v-model="form.remember">Remember Me</el-checkbox><!-- {{ old('remember') ? 'checked' : '' }} -->
              </div>
              <div class="form-group row mb-0">
                <el-button type="primary" class="btn btn-primary" @click="login">
                Login
                </el-button>
                  <!-- 
                  @if (Route::has('password.request'))
                    <a class="btn btn-link" href="/password/request">
                      Forgot Your Password?
                    </a>
                  @endif
                   -->
              </div>
            </el-form>
            <button @click="onGetData">データ取得</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /*
  middleware({ store, redirect }) {
    if(store.$auth.loggedIn) {
      redirect('/');
    }
  },*/
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: ''
      }
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
    login() {
      this.$store.dispatch("login", this.form)
      //this.$axios.get("/www/api/login")
      /*
      try {
        await this.$auth.loginWith('local', { data: this.form });
      } catch(err) {
        console.log(err);
      }*/
    },
    onGetData() {
      console.log("onGetData")
      this.$axios.get("/www/api/get")
      .then((res) => {
          console.log(res)
      })
      .catch((e) => {
        console.log(e)
      })
    },
  }
}
</script>
