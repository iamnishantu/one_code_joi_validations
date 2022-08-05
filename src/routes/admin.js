const router = require('express').Router();
const {adminController} = require('../controllers');
const validators = require('../middlewares/validators');
const auth = require('../middlewares/auth');

router.post('/register', auth.admin, validators.admin.register, adminController.register);
router.post('/login', validators.admin.login, adminController.login);

module.exports = router;