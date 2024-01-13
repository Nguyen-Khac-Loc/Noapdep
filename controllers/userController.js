const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../handlers/factoryHandler");
const Email = require("../handlers/mailHandler");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users/');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   },
// });

const multerStorage = multer.memoryStorage();
//kiem tra file upload
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) cb(null, true);
	else {
		cb(new AppError("Hãy tải lên hình ảnh hợp lệ", 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single("photo");

const resizeUserPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`public/img/users/${req.file.filename}`);
	next();
});

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

const getSelf = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

const updateSelf = catchAsync(async (req, res, next) => {
	// const user = User.findOne(req.user.id);
	if (req.body.password || req.body.confirmPassword) {
		return next(new AppError("Dùng /updatemypassword để đổi mật khẩu", 400));
	}
	const filteredBody = filterObj(req.body, "name", "email");
	if (req.file) filteredBody.photo = req.file.filename;

	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
});

const deleteSelf = catchAsync(async (req, res, next) => {
	const deletedUser = await User.findByIdAndUpdate(req.user.id, { active: false });
	res.clearCookie("jwt");
	await new Email(deletedUser).sendDeletedAccount();
	res.status(204).json({
		status: "success",
		data: null,
	});
});

const getMyReviews = catchAsync(async (req, res, next) => {
	const reviews = await Review.find({ user: req.user.id }).select('-user');
	res.status(200).json({
		status: "success",
		results: reviews.length,
		reviews
	});
});

const createUser = async (req, res) => {
	res.status(500).json({
		status: "error",
		message: "Dung /signup",
	});
};

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);

//ko cap nhat password = cai nay
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

module.exports = {
	getMyReviews,
	uploadUserPhoto,
	resizeUserPhoto,
	getAllUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
	getSelf,
	updateSelf,
	deleteSelf,
};
