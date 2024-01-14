const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

const getIndex = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();
	res.status(200).render("index", {
		title: "Trang chủ",
		showButton: true,
		tours,
	});
});

const getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});

	if (!tour) {
		return next(new AppError(`Không tìm thấy tour ${req.params.slug}`, 404));
	}

	res.status(200).render("tour", {
		showButton: true,
		title: `${tour.name} Tour`,
		tour,
	});
});

const getLogin = (req, res) => {
	res.status(200).render("authen", {
		title: "Đăng nhập",
		showButton: false,
	});
};

const getAccount = (req, res) => {
	res.status(200).render("account", {
		title: "Tài khoản của tôi",
		showButton: false,
	});
};

const getMyTours = catchAsync(async (req, res, next) => {
	const bookings = await Booking.find({ user: req.user.id });

	const toursId = bookings.map((id) => id.tour);
	const tours = await Tour.find({ _id: { $in: toursId } });

	res.status(200).render("index", {
		title: "Các tour đã đặt",
		showButton: true,
		tours,
	});
});

const updateUserData = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.status(200).render("account", {
		title: "Tài khoản của tôi",
		user: updatedUser,
		showButton: false,
	});
});


module.exports = {
	getMyTours,
	getIndex,
	updateUserData,
	getTour,
	getAccount,
	getLogin,
	
};
