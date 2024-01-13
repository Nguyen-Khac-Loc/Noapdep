const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Không hợp lệ ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Đã tồn tại: ${value}. Mời bạn nhập lại.`;

  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Lỗi!. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Token không hợp lệ. Hãy đăng nhập lại", 401);
const handleJWTExpiredError = () =>
  new AppError("Token đã hết hạn. Hãy đăng nhập lại", 401);

const sendDevErr = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //rendered page
  return res.status(err.statusCode).render("error", {
    title: "Lỗi " + err.statusCode,
    message: err.message,
  });
};

const sendProdErr = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // Loi du doan dc
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //lỗi ko xac dinh, loi code
    console.error("!!!!!!!!ERROR!!!!!!!!\n", err);
    return res.status(500).json({
      status: "error",
      message: "Hãy thử lại sau",
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Lỗi " + err.statusCode,
      message: err.message,
    });
  }
  //lỗi ko xac dinh, loi code
  console.error("!!!!!!!!ERROR!!!!!!!!\n", err);
  return res.status(err.statusCode).render("error", {
    title: "Lỗi " + err.statusCode,
    message: "Hãy thử lại sau.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDevErr(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.errmsg = err.errmsg;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendProdErr(error, req, res);
  }
};
