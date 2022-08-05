const router = require('express').Router();
const {offerController} = require('../controllers');
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validators');

router.post('/', auth.admin, validators.offer.addOffer, offerController.addOffer);

router.get('/all', offerController.getAllOffers);

router.put('/trending/add', auth.admin, validators.offer.addToTrending,
offerController.makeOfferTrending);

router.put('/trending/remove', auth.admin, validators.offer.removeFromTrending, 
offerController.removeFromTrending);

router.get('/trending', offerController.getTrendingOffer);

router.get('/category/:categoryId', validators.offer.getOffersByCategory, offerController.getOffersByCategory);

router.get('/:offerId', auth.userOrAdmin, offerController.getOfferById);

router.delete('/:offerId', validators.offer.deleteOffer, offerController.deleteOffer);

router.put('/:offerId', validators.offer.updateOffer, offerController.updateOffer);
module.exports = router;