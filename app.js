const express = require('express');
const rateLimit = require('express-rate-limit');
const logger = require('morgan');
const mongosanitize = require('express-mongo-sanitize');
const path = require('path');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
// const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./handlers/errorHandler');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const bookingRouter = require('./routes/bookingRoute');
const locationRouter = require('./routes/locationRoute');
const viewRouter = require('./routes/viewRoute');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
//read static file
app.use(express.static(path.join(__dirname, 'public')));

//giới hạn request
app.use(
	'/api',
	rateLimit({
		max: 100,
		windowMs: 60 * 60 * 1000,
		message: 'Qua nhiều request.\nHãy thử lại sau 1 tiếng..',
	}),
);

//dev logger
if (process.env.NODE_ENV === 'development') {
	app.use(logger('dev'));
}

//body parser
app.use(express.json({ limit: '10kb' }));
app.use(
	express.urlencoded({ extended: true, encoding: 'utf8', limit: '10kb' }),
);
app.use(cookieParser());

// app.use(cors());
//nosql query injection
app.use(mongosanitize());

//hpp
app.use(
	hpp({
		whitelist: [
			'price',
			'difficulty',
			'maxGroupSize',
			'duration',
			'ratingsQuantity',
			'ratingsAverage',
		],
	}),
);

app.use(compression());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	// console.log(req.cookies);
	next();
});
// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/locations', locationRouter);
app.use('/api/bookings', bookingRouter);
app.all('*', (req, res, next) => {
	next(new AppError(`Không tìm thấy ${req.originalUrl} trên server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
