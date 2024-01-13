const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Tên không được để trống.'],
			unique: true,
			trim: true,
			maxlength: [40, "Tên không được vượt quá 40 kí tự."],
			minlength: [10, "Tên không được ít hơn 10 kí tự."],
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, "Tour phải có số ngày đi."],
		},

		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Hãy đánh giá từ 1-5"],
			max: [5, "Hãy đánh giá từ 1-5"],
			set: (value) => Math.round(value * 10) / 10,
		},
		ratingsQuantity: {
			type: Number,
			default: 1,
		},
		price: {
			type: Number,
			required: [true, "Tour phải có giá tiền"],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (value) {
					//this trỏ tới doc hiện tại đang đc tạo (NEW CREATE)
					return value < this.price;
				},
				message: "Giá giảm ({VALUE}) phải bé hơn giá gốc",
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, "Tour phải có mô tả"],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, "Tour phải có ảnh bìa"],
			default: "imageCoverplaceholder.png",
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now,
			select: false,
		},
		startDates: Date,
		startLocation: String,
		locations: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Location",
			},
		],
		guides: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual("reviews", {
	ref: "Review",
	localField: "_id",
	foreignField: "tour",
});

//DOCUMENT MIDDLEWARE
//pre() sẽ chạy trc lệnh ở đây là 'save' vd:.save() .create()..
tourSchema.pre("save", function (next) {
	this.slug = slugify.default(this.name, { lower: true });
	next();
});


tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: "guides",
		select: "-__v -passwordChangedAt",
	}).populate({
		path: "locations",
	});
	next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
