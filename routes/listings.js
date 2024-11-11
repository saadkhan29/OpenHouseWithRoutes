const express = require('express');

const router = express.Router();

const listingCtrl = require('../controllers/listings');

router.get('/', listingCtrl.index);
router.get('/new', listingCtrl.new);
router.post('/', listingCtrl.create);
router.get('/:listingId', listingCtrl.getById);
router.delete('/:listingId', listingCtrl.deleteById);

router.get('/:listingId/edit', listingCtrl.edit);
router.put('/:listingId', listingCtrl.update);

router.post('/:listingId/favorited-by/:userId', listingCtrl.fav);
router.delete('/:listingId/favorited-by/:userId', listingCtrl.unFav);
module.exports = router;