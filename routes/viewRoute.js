const express = require("express");

const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get(
	"/",
	bookingController.createBookingCheckout,
	authController.isLoggedIn,
	viewController.getIndex
);

router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/authen", authController.isLoggedIn, viewController.getLogin);
router.get("/me", authController.protect, viewController.getAccount);
router.get("/my-tours", authController.protect, viewController.getMyTours);


router.post(
	"/submit-user-data",
	authController.protect,
	viewController.updateUserData
);
module.exports = router;
