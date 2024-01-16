const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'review ko đc de trong'],
		},
		rating: {
			type: Number,
			min: [1, 'Hãy đánh giá từ 1-5'],
			max: [5, 'Hãy đánh giá từ 1-5'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
			select: false,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'review phai thuoc ve nguoi dung'],
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			required: [true, 'review phai thuoc ve tour'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
	this
		.populate({
			path: 'user',
			select: 'name photo',
		});
	// .populate({
	// 	path: 'tour',
	// 	select: 'name',
	// });
	next();
});

reviewSchema.statics.calcAvgRatings = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);
	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating,
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 1,
			ratingsAverage: 4.5,
		});
	}
};

reviewSchema.post('save', function () {
	this.constructor.calcAvgRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.review = await this.clone().findOne();
	next();
});

reviewSchema.post(/^findOneAnd/, async function () {
	// this.review = await this.findOne();->ko the chay o post,vi query da dc thuc hien
	await this.review.constructor.calcAvgRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
