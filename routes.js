const router = require('express').Router();
const controller = require('./controllers/controller');

router.get('/', controller.defaultLaunch);

//TOOL:  OpenID Connect validation flow
router.get('/oidc', controller.cretaeOidcResponse);

//TOOL:  OpenID Connect validation flow
router.post('/oidc', controller.cretaeOidcResponse);

//TOOL: Generate Token
router.post("/oauth2/token", controller.generateToken);

//TOOL: Validate launch request and launch
router.post('/project/submit', controller.launchTool);

//TOOL: Display launch page
router.get("/project/submit", controller.displayLaucnhPage);

module.exports = router;
