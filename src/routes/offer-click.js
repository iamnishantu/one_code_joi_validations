const router = require('express').Router();
const {offerClickController} = require('../controllers');

router.get('/', offerClickController.offerClick);
router.get('/fulfill', offerClickController.fulfillClick);

module.exports = router;