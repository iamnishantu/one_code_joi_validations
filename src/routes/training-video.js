const router = require('express').Router();
const {trainingVideoController} = require('../controllers');
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validators');

router.post('/', auth.admin, validators.trainingVideo.addVideo,
trainingVideoController.addVideo);

router.get('/', trainingVideoController.getVideos);

router.put('/:videoId', auth.admin, 
[validators.trainingVideo.updateVideo.videoId, validators.trainingVideo.updateVideo.updatePayload],
trainingVideoController.updateVideo);

router.delete('/:videoId', auth.admin, validators.trainingVideo.deleteVideo,
trainingVideoController.deleteVideo);

module.exports = router;
