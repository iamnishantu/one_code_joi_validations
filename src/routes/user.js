const router = require('express').Router();
const {userController} = require('../controllers');
const validators = require('../middlewares/validators');
const auth = require('../middlewares/auth');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images')
    },
    filename: function(req, file, cb) {
        cb(null, `${req.user._id.toString()}-${(new Date()).getTime()}.${file.mimetype.split('/')[file.mimetype.split('/').length - 1]}`)
    }
});

const upload = multer({storage});

router.post('/signup', validators.user.signup, userController.signup);

router.post('/signup-verification', validators.user.registrationVerification, 
userController.verifyRegistration);

router.post("/login/facebook", userController.loginWithFacebook);

router.post("/login/google", userController.loginWithGoogle)

router.put(
    "/phone-number", 
    auth.user, 
    validators.user.updatePhoneNumber, 
    userController.updatePhoneNumber
);

router.post(
    "/verify-phone-number", 
    auth.user, 
    validators.user.verifyPhoneNumber, 
    userController.verifyPhoneNumber
);

router.get('/', auth.user, userController.getUser);

router.get('/all', auth.admin, userController.getAllUsers);

router.get('/personal-details', auth.user, userController.getUserPersonalDetails);

router.put('/personal-details', auth.user, validators.user.updatePersonalDetails, 
userController.updateUserDetails);

router.put('/aadhaar-number', auth.user, validators.user.updateAadhaarNumber,
 userController.updateAadhaarNumber);

router.put('/pan-number', auth.user, validators.user.updatePanNumber,
userController.updatePanNumber);

router.put('/profile-image', auth.user, upload.single('image'), userController.updateProfileImage);

router.post('/login', validators.user.login, userController.login);

router.post('/login-otp-verification', validators.user.loginOtpVerification, 
userController.loginOtpVerification);

router.get('/bank-details', auth.user, userController.getBankDetails);

router.put('/bank-details', auth.user, validators.user.updateBankDetails, 
userController.updateBankDetails);

router.get('/:userId', auth.admin, userController.getUserAdmin);

module.exports = router;