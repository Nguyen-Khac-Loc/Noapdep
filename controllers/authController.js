/* eslint-disable arrow-body-style */
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../handlers/mailHandler");

const signToken = function (id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};

const createSendToken = function (user, statusCode, res) {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

	res.cookie("jwt", token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({
		token,
		status: "success",
		// data: {
		// 	user,
		// },
	});
};

const signup = catchAsync(async (req, res, next) => {
	//req.body
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
	});
	const url = `${req.protocol}://${req.get("host")}/me`;
	// console.log(url);
	// await new Email(newUser, url).sendWelcome();
	createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("Email và mật khẩu không được để trống", 400));
	}

	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.checkPassword(password, user.password))) {
		return next(new AppError("Email hoặc mật khẩu không đúng", 401));
	}
	createSendToken(user, 200, res);
});

const logout = (req, res) => {
	//   res.clearCookie("jwt");
	res.cookie("jwt", "destroy", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({
		status: "success",
		message: "Đã đăng xuất!",
	});
};
const protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(new AppError("Bạn chưa đăng nhập", 401));
	}
	//kiểm tra token hop le
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const currentUser = await User.findById(decoded.id);

	//kiểm tra user ton tai
	if (!currentUser) {
		return next(new AppError("Người dùng không tồn tại", 401));
	}

	//kiem tra pw bị đổi sau khi token đc tạo
	if (currentUser.changePasswordAfter(decoded.iat)) {
		return next(new AppError("Bạn đã đổi mật khẩu. Hãy đăng nhập lại"), 401);
	}
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

//middleware render trang,
const isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			//kiem tra token hop le
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);
			//kiểm tra user ton tai
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			}
			//kiem tra pw bị đổi sau khi token đc tạo
			if (currentUser.changePasswordAfter(decoded.iat)) {
				return next();
			}
			//co user dang nhap
			//locals giup template nhan data
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			return next();
		}
	}
	next();
};

const restrictTo =
	(...roles) =>
		(req, res, next) => {
			if (!roles.includes(req.user.role))
				return next(new AppError("Bạn không đủ quyền truy cập!", 403));
			next();
		};

const updatePassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	if (!(await user.checkPassword(req.body.passwordCurrent, user.password)))
		return next(new AppError("Mật khẩu hiện tại không đúng.", 401));

	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;

	await user.save();
	createSendToken(user, 200, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError("Email không tồn tại.", 404));
	}
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	try {
		const resetURL = `${req.protocol}://${req.get(
			"host"
		)}/users/resetpassword/${resetToken}`;
		await new Email(user, resetURL).sendResetPassword();
		res.status(200).json({
			status: "success",
			message: "Email tạo mới mật khẩu đã được gởi.",
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new AppError("Lỗi khi gửi email. Hãy thử lại sau..", 500));
	}
});

const resetPassword = catchAsync(async (req, res, next) => {
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user)
		return next(new AppError("Token không hợp lệ hoặc đã hết hạn.", 400));
	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	createSendToken(user, 200, res);
});

module.exports = {
	isLoggedIn,
	signup,
	login,
	logout,
	protect,
	restrictTo,
	forgotPassword,
	resetPassword,
	updatePassword,
};
