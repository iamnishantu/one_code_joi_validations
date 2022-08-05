const router = require('express').Router();
const {exportController} = require('../controllers');
const validators = require('../middlewares/validators');
const auth = require('../middlewares/auth');

router.get('/leads', auth.admin, validators.export.exportLead, exportController.leads)
module.exports = router;