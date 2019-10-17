const jwt = require('jsonwebtoken');
const nonce = require('nonce-generator');
const platformData = require('../data/platform-data');
const toolData = require('../data/toolData');
const keys = require('../data/keys');
const url = require('url');

exports.defaultLaunch = (req,res) => {
  res.send("Default Launch successful");
};

exports.cretaeOidcResponse = (req,res) => {
  let privateKEY = keys.private_key;

  if(req.body.client_id != platformData.client_id) {
    res.render('error.ejs',{platformNotRegistered : true});
  }

  var initLoginParams = {
    "client_id":  platformData.client_id,
    "login_hint": req.body.login_hint,
    "lti_message_hint": req.body.lti_message_hint,
    "nonce":  nonce(20),
    "prompt": "none",
    "redirect_uri": toolData.launch_url,
    "response_mode": "form_post",
    "response_type":  "id_token",
    "scope":  "openid"
};

var payload = {
    "tool_id": 536,
    "state_nonce": initLoginParams.nonce,
    "params": {
      "iss": req.body.iss,
      "client_id": req.body.client_id,
      "lti_deployment_id": req.body.lti_deployment_id,
      "target_link_uri": toolData.launch_url,
      "login_hint": req.body.login_hint,
      "lti_message_hint": req.body.lti_message_hint,
      "commit": req.body.commit,
      "controller": "lti/login_initiations",
      "action": "create",
      "tool_id": "536"
    },
    "iss": toolData.launch_url,
    "sub": platformData.client_id,
    "aud": "",
    "iat": Date.now(),
    "exp": Date.now() + 300,
    "jti": nonce(20)
  };

  const token = jwt.sign(payload, privateKEY, { algorithm: 'RS256', keyid:nonce(20)});

  initLoginParams.state = token;

  return res.render('initLogin.ejs' ,{
    loginResParams : initLoginParams, 
    action: platformData.oidc_auth_url
  });
};

exports.validateLaunch = (req,res) => {
  jwt.verify(req.body.id_token, platformData.publicKey, (err, decoded) => {
    if(err) {
    res.render('error.ejs' , {invalidSignature : true});
    }
    
    var decode_payload = jwt.decode(req.body.id_token, {complete: true}).payload;

    if(decode_payload["https://purl.imsglobal.org/spec/lti/claim/message_type"] != "LtiResourceLinkRequest" || decode_payload["https://purl.imsglobal.org/spec/lti/claim/version"] != "1.3.0" || decode_payload["https://purl.imsglobal.org/spec/lti/claim/deployment_id"] != platformData.deployment_id ) {
      return res.render('error.ejs', {
        badRequest: true
    });
    }

    if(decode_payload['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'] != toolData.launch_url) {
      throw new Error("Bad request : Redirect url is not valid ");
    }
    
    return res.redirect(url.format({
      pathname: toolData.display_url,
      query: decode_payload
    }));
  });
};

exports.displayLaucnhPage = (req,res) => {
  return res.render('launch.ejs', {
    params : req.query
  });
};

