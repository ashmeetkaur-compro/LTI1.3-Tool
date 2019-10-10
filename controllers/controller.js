const platformData = require('../data/platform-data');
const jwt = require('jsonwebtoken');

exports.defaultLaunch = (req,res) => {
  res.send("Default Launch successful");
};

exports.cretaeOidcResponse = (req,res) => {
  let init_login_Request = req.body;

  if(init_login_Request.iss != platformData.iss) {
    res.send(['Issuer invalid: not registered']);
  }

  res.send ({
    scope: 'openid',
    response_type: 'id_token',
    client_id: 'SDF7ASDLSFDS9',
    redirect_uri: 'https://piedpiper.localtunnel.me/project/submit',
    login_hint: init_login_Request.login_hint,
    state: create_unique_string(30, true),
    response_mode: 'form_post',
    prompt: 'none'
  });
};

exports.launchTool = (req,res) => {
  const jwt_string = req.body.id_token;
  let basic_decoded = jwt.decode(jwt_string, {complete: true});
};

exports.generateToken = (req,res) => { 
};

exports.displayLaucnhPage = (req,res) => {
};

