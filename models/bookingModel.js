const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: [true, 'booking phai thuoc ve 1 tour'],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'booking phai thuoc ve 1 user'],
	},
	price: {
		type: Number,
		required: [true, 'booking phai co thanh tien'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	paid: {
		type: Boolean,
		default: true,
	},
});

bookingSchema.pre(/^find/, function (next) {
	this.populate({ path: 'user', select: '-__v -role' });
	next();
});
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
