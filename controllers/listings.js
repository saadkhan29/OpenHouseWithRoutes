

const Listing = require('../models/listing');

exports.index = async(req, res) => {
  try{
    const populatedListings = await Listing.find({}).populate('owner');
  console.log('Populated Listings: ', populatedListings);
  res.render('listings/index.ejs', {listings: populatedListings});
  } catch(err) {
    console.log(err);
    res.redirect('/');
  }
};

exports.new = async(req, res) => {
  res.render('listings/new.ejs');
};

exports.create = async(req, res) => {
  req.body.owner = req.session.user._id;
  await Listing.create(req.body);
  res.redirect('/listings');
};

exports.getById = async(req, res) => {
  try{
    const populatedListings = await Listing.findById(req.params.listingId).populate('owner');
    const userHasFavorited = populatedListings.favoritedByUsers.some((user) => 
      user.equals(req.session.user._id)
    )
    res.render('listings/show.ejs', {listing: populatedListings,
      userHasFavorited: userHasFavorited
    })
  } catch(err){
    console.log(err);
    res.redirect('/');
  }
};

exports.deleteById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (listing.owner.equals(req.session.user._id)) {
      await listing.deleteOne();
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};


exports.edit = async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    res.render('listings/edit.ejs', {
      listing: currentListing,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

exports.fav = async(req, res) => {
  try{
    await Listing.findByIdAndUpdate(req.params.listingId, {
      $push: { favoritedByUsers: req.params.userId }
    });
    res.redirect(`/listings/${req.params.listingId}`)
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};

exports.unFav = async(req, res) => {
  try{
    await Listing.findByIdAndUpdate(req.params.listingId, {
      $pull: { favoritedByUsers: req.params.userId}
    })
    res.redirect(`/listings/${req.params.listingId}`)
  } catch(err){
    console.log(err);
    res.redirect('/');
  }
};
