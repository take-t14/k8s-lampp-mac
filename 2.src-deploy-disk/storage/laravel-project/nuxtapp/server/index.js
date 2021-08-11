const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require("express-session");

const environment = process.env.NODE_ENV || 'dev';
process.env = require(`../env.${environment}.js`)
console.log(`../env.${environment}.js`)
console.log(process.env)
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev && process.env.NOBUILD !== 'on') {
  const builder = new Builder(nuxt)
  builder.build()
}

app.set('port', port)

// req.body へアクセスするために body-parser を使う
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// session middleware
app.use(session({
  // 必須項目（署名を行うために使います）
  secret: "super-secret-key",
  // 推奨項目（セッション内容に変更がない場合にも保存する場合にはtrue）
  resave: false,
  // 推奨項目（新規にセッションを生成して何も代入されていなくても値を入れる場合にはtrue）
  saveUninitialized: false,
  // アクセスの度に、有効期限を伸ばす場合にはtrue
  rolling : true,
  // クッキー名（デフォルトでは「connect.sid」）
  name : 'connect.sid',
  // 一般的なCookie指定
  // デフォルトは「{ path: '/', httpOnly: true, secure: false, maxAge: null }」
  cookie: {
    // 24 hours
    maxAge: 24 * 60 * 60 * 1000
  }
}))

app.use(cookieParser())
const needCSRF = false
//app.use(csrf({ cookie: true }))
const conditionalCSRF = function (req, res, next) {
  //compute needCSRF here as appropriate based on req.path or whatever
  if (needCSRF) {
    csrf(req, res, next);
  } else {
    next();
  }
}
app.use(conditionalCSRF)
// Import API Routes
const baseUrl = process.env.BASE_APP_URL || '/'
//… some middleware injection 
app.use(nuxt.render)
// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // 
