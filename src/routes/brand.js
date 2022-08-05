const router = require('express').Router();
const {brandController} = require('../controllers');
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validators');
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

router.post('/', auth.admin, upload.single('image'), validators.brand.addBrand, brandController.addBrand);
router.delete('/:brandId', auth.admin, validators.brand.deleteBrand, brandController.deleteBrand);
router.get('/', brandController.getAllBrands);
router.put('/:brandId', auth.admin, upload.single('image'), validators.brand.updateBrand.brandId, 
validators.brand.updateBrand.updatePayload, brandController.updateBrand);
module.exports = router;