const router = require('express').Router();
const {splashScreenController} = require('../controllers');
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validators');

router.post('/', auth.admin, validators.splashScreen.addSplashScreen, 
splashScreenController.addSplashScreen);

router.get('/', splashScreenController.getSplashScreen);

router.put('/screen', auth.admin, validators.splashScreen.updateScreens,
splashScreenController.updateSplashScreen);

router.put('/video', auth.admin, validators.splashScreen.updateVideo,
splashScreenController.updateVideoUrl);

router.put('/title', auth.admin, validators.splashScreen.updateTitle,
splashScreenController.updateAppTitle)

module.exports = router;