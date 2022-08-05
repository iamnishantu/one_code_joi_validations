const router = require('express').Router();

router.use('/admin', require('./admin'));
router.use('/category', require('./category'));
router.use('/brand', require('./brand'));
router.use('/user', require('./user'));
router.use('/training-video', require('./training-video'));
router.use('/lead', require('./lead'));
router.use('/credit-line', require('./credit-line'));
router.use('/image-upload', require('./image-upload'));
router.use('/splash-screen', require('./splash-screen'));
router.use('/offer', require('./offer'));
router.use('/wallet', require('./wallet'));
router.use('/offer-click', require('./offer-click'));
router.use('/export', require('./export-route'));
router.use('/support-ticket', require('./support-ticket'));
module.exports = router;