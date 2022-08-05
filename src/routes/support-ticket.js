const router = require('express').Router();
const {supportTicketController} = require('../controllers');
const auth = require('../middlewares/auth');

router.post('/', auth.user, supportTicketController.generateTicket);

module.exports = router;