const {walletController} = require('../controllers');
const auth = require('../middlewares/auth');
const router = require('express').Router();

router.get('/', auth.userOrAdmin, walletController.getWallet);

module.exports = router;
