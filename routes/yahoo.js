var express = require("express");
var router = express.Router();

const YahooFantasy = require("yahoo-fantasy");

const _yahooAppKey = process.env.YAHOO_APP_KEY;
const _yahooAppSecret = process.env.YAHOO_APP_SECRET;
const _yahooRedirectUri = process.env.YAHOO_REDIRECT_URI;

// Token Callback
router.tokenCallback = function ({ access_token, refresh_token }) {
  // console.log(`Access Token: ${access_token}`)
  // console.log(`Refresh Token: ${refresh_token}`)
  return new Promise((resolve, reject) => {
    // client is redis client
    // client.set("accessToken", access_token, (err, res) => {
    //   // could probably handle this with a multi...
    //   // and you know... handle the errors...
    //   // good thing this is only an example!
    //   client.set("accessToken", access_token, (err, res) => {
    //     return resolve();
    //   });
    // });
    if (access_token) {
      // console.log('Access token received!');
      return resolve();
    }

    return reject("No access token received!");
  });
};

// Setup 
router.yf = new YahooFantasy(
    _yahooAppKey,
    _yahooAppSecret,
  router.tokenCallback,
  _yahooRedirectUri
);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Sends the Yahoo OAuth Redirect
router.get("/auth", (req, res) => {
  router.yf.auth(res);
});

router.get("/auth/callback", (req, res) => {
  router.yf.authCallback(req, (err, authObj) => {
    if (err) {
      handleError(res, err);
      return;
    }

    if (authObj) {
      console.log(authObj);
    }

    // console.log('auth/callback')
    res.json({ authenticated: true });
  });
});

module.exports = router;
