const express = require('express')
//const router = express.Router();
const app = express();
app.use((req, res, next) => {
  console.log("router.use");
  Object.setPrototypeOf(req, app.request);
  Object.setPrototypeOf(res, app.response);
  req.res = res;
  res.req = req;
  next();
});


// API: /api/login
app.post("/login", (req, res) => {
  console.log("router.post(/api/login)")
  if (!!req.body.authUser) {
    console.log("if (!!req.body.authUser) {")
    console.log(req.body.authUser)
    console.log(req.session)
    req.session.authUser = req.body.authUser; // セッションにつめる
    return res.json(req.body.authUser);       // レスポンスはそのまま返す
  }
  res.status(401).json({ message: "Bad credentials" });
});

// API: /api/logout
app.post("/logout", (req, res) => {
    console.log("router.post(/api/logout)");
    delete req.session.authUser;                // セッションの削除
  res.json({ ok: true });
});

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app
};