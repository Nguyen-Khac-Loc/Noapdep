const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) {
			return next(
				new AppError(`Không tim thấy document có id: ${req.params.id}`, 404)
			);
		}
		res.status(204).json({
			status: "success",
			data: null,
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(
				new AppError(`Không tim thấy document có id: ${req.params.id}`, 404)
			);
		}

		res.status(200).json({
			status: "success",
			data: {
				data: doc,
			},
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);
		res.status(201).json({
			status: "success",
			requestedAt: req.requestTime,
			data: {
				data: doc,
			},
		});
	});

exports.getOne = (Model, popOption) =>
	catchAsync(async (req, res, next) => {
		//findOne({_id:req.params.id})
		let query = Model.findById(req.params.id);
		if (popOption) query = query.populate(popOption);
		const doc = await query;
		if (!doc) {
			return next(
				new AppError(`Không tìm thấy document có id: ${req.params.id}`, 404)
			);
		}
		res.status(200).json({
			status: "success",
			data: {
				data: doc,
			},
		});
	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		//nested GET reviews voi tour
		let filter = {};
		if (req.params.tourId) filter = { tour: req.params.tourId };
		else if (req.params.userId) filter = { user: req.params.userId };

		//EXECUTE QUERY
		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();
		// const doc = await features.query.explain();
		const doc = await features.query;

		//RESPONSE
		res.status(200).json({
			status: "success",
			requestedAt: req.requestTime,
			results: doc.length,
			data: {
				data: doc,
			},
		});
	});
