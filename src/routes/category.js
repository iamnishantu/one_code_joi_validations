const router = require('express').Router();
const {categoryController} = require('../controllers');
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

router.post('/', auth.admin, upload.single('image'), validators.category.addCategory ,
categoryController.addCategory);

router.get('/', categoryController.getCategories);

router.put('/:categoryId', auth.admin, upload.single('image'), 
validators.category.updateCategory.categoryId, validators.category.updateCategory.updatePayload,
categoryController.updateCategory);

router.delete('/:categoryId', auth.admin, validators.category.deleteCategory, 
categoryController.deleteCategory);

router.put('/set-priority/:categoryId', auth.admin, validators.category.priority, 
categoryController.setPriority);

router.put('/remove-priority/:categoryId', auth.admin, validators.category.priority, 
categoryController.removePriority);

router.get('/priority', categoryController.getPriorityCategories);

module.exports = router;