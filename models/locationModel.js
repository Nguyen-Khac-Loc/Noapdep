const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
	type: {
		type: String,
		default: "Point",
		enum: ["Point"],
	},
	coordinates: [Number],
	description: {
		type: String,
		unique: true,
		trim: true,
		required: [true, "Location phải có mô tả"],
	},
	day: Number,
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;