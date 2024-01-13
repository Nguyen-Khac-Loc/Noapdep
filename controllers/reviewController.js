const Review = require('../models/reviewModel');
const factory = require('../handlers/factoryHandler');
// const catchAsync = require('../utils/catchAsync');

const setTourUserIds = (req, res, next) => {
	//nested route
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;
	next();
};

const getAllReviews = factory.getAll(Review);
const getReview = factory.getOne(Review);
const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

module.exports = {
	getAllReviews,
	getReview,
	createReview,
	setTourUserIds,
	updateReview,
	deleteReview,
};
