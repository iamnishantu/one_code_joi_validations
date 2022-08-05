const router = require('express').Router();
const {leadController} = require('../controllers');
const auth = require('../middlewares/auth');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './csv')
    },
    filename: function(req, file, cb) {
        cb(null, `${req.user._id.toString()}-${(new Date()).getTime()}.${file.mimetype.split('/')[file.mimetype.split('/').length - 1]}`)
    }
});

const upload = multer({storage});

router.get('/all', auth.admin, leadController.getAllLeads);

router.get('/', auth.userOrAdmin, leadController.getLeadsOfUser);

router.get('/status', auth.user, leadController.getStatusLeads);

router.post('/complete', auth.admin, upload.single('file'), leadController.completeLeads);

router.get('/count', auth.user, leadController.getLeadCount);
module.exports = router;