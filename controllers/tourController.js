const multer = require("multer");
const sharp = require("sharp");

const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../handlers/factoryHandler");

const multerStorage = multer.memoryStorage();

const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, { path: "reviews" });
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);
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

const uploadTourImages = upload.fields([
	{ name: "imageCover", maxCount: 1 },
	{ name: "images", maxCount: 3 },
]);

const resizeTourImages = catchAsync(async (req, res, next) => {
	if (!req.files || (!req.files.imageCover && !req.files.images)) return next();

	//coverImage
	req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
	await sharp(req.files.imageCover[0].buffer)
		.resize(2000, 1333)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`public/img/tours/${req.body.imageCover}`);

	//images
	req.body.images = [];
	await Promise.all(
		req.files.images.map(async (file, i) => {
			const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
			await sharp(file.buffer)
				.resize(2000, 1333)
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile(`public/img/tours/${filename}`);
			req.body.images.push(filename);
		})
	);

	next();
});

const LowPriceTour = (req, res, next) => {
	// req.query.find = { price: { $lte: 1000 } };
	req.query.limit = "5";
	req.query.sort = "price";
	req.query.fields = "name,price,ratingsAverage,summary,duration";

	next();
};

module.exports = {
	uploadTourImages,
	resizeTourImages,
	LowPriceTour,
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
};
