const router = require('express').Router();
const {imageUploadController} = require('../controllers');
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

router.post('/', auth.userOrAdmin, upload.single('image'), imageUploadController.imageUpload);

module.exports = router;