const router = require('express').Router();
const {creditLineController} = require('../controllers');
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validators');

router.post('/credit-limit', auth.admin, validators.creditLine.setLimit, 
creditLineController.setCreditLine);

router.get('/withdrawals', auth.userOrAdmin, validators.creditLine.getWithdrawals,
creditLineController.getWithdrawals);

module.exports = router;