const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factory = require('../handlers/factoryHandler');
const catchAsync = require('../utils/catchAsync');

const getCheckoutSession = catchAsync(async (req, res, next) => {
	//get tour checkout
	const tour = await Tour.findById(req.params.tourId);
	//tao session checkout
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId
			}&user=${req.user.id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		line_items: [
			{
				// name: `${tour.name} Tour`,
				// description: tour.summary,
				// images: [`/img/tours/${tour.imageCover}`],
				// amount: tour.price,
				// quantity: 1,
				// currency: 'vnd',
				price_data: {
					currency: 'vnd',
					unit_amount: tour.price,
					product_data: {
						name: `${tour.name}`,
						description: tour.summary,
						images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
					},
				},
				quantity: 1,
			},
		],
		mode: 'payment',
	});
	res.status(200).json({
		status: 'success',
		session,
	});
});
const createBookingCheckout = catchAsync(async (req, res, next) => {
	const { tour, user, price } = req.query;
	if (!tour && !user && !price) return next();
	await Booking.create({ tour, user, price });
	res.redirect(req.originalUrl.split('?')[0]);
});

const createBooking = factory.createOne(Booking);
const getAllBookings = factory.getAll(Booking);
const getBooking = factory.getOne(Booking);
const updateBooking = factory.updateOne(Booking);
const deleteBooking = factory.deleteOne(Booking);


module.exports = {
	getCheckoutSession,
	createBookingCheckout,
	createBooking,
	getAllBookings,
	getBooking,
	updateBooking,
	deleteBooking,
};
