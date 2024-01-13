const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoute');
const bookingRouter = require('./bookingRoute');


const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);


router.use(authController.protect);

router.use('/:userId/bookings', bookingRouter);
router.use('/:userId/reviews', reviewRouter);
router.patch('/updatemypassword', authController.updatePassword);
router.get('/me', userController.getSelf, userController.getUser);
router.patch('/updateme',
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateSelf);

router.delete('/deleteme', userController.deleteSelf);

router.use(authController.restrictTo('admin'));

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
