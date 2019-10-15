const router = require('express').Router();
const controller = require('./controllers/controller');

router.get('/', controller.defaultLaunch);

//TOOL:  OpenID Connect validation flow - Not yet implemented
router.get('/oidc', controller.cretaeOidcResponse);

//TOOL:  OpenID Connect validation flow
router.post('/oidc', controller.cretaeOidcResponse);

//TOOL: Validate launch request and launch
router.post('/submit', controller.validateLaunch);

//TOOL: Display launch page
router.get('/submit', controller.displayLaucnhPage);

module.exports = router;
