const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Hãy nhập tên."],
	},
	email: {
		type: String,
		required: [true, "Hãy nhập email."],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Email không hợp lệ."],
	},
	photo: {
		type: String,
		default: "default.jpg",
	},
	role: {
		type: String,
		enum: ["user", "admin", "guide", "lead-guide"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Hãy nhập mật khẩu."],
		minlength: 8,
		select: false,
	},
	confirmPassword: {
		type: String,
		required: [true, "Hãy xác nhận mật khẩu."],
		validate: {
			//chỉ hoạt động khi create(), save()[như findOneAndUpdate]
			validator: function (confirmpassword) {
				return confirmpassword === this.password;
			},
			message: "Mật khẩu xác nhận không khớp.",
		},
	},
	passwordChangedAt: {
		type: Date,
		select: false,
	},
	passwordResetToken: {},
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	//hash pw vs cost = 12
	this.password = await bcrypt.hash(this.password, 12);
	this.confirmPassword = undefined;

	next();
});

userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.checkPassword = async function (bodyPassword, userPassword) {
	return await bcrypt.compare(bodyPassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	// console.log({ resetToken }, this.passwordResetToken);
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
