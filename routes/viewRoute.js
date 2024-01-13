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
router.get("/forgotpassword", viewController.forgotPassword);
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.getLogin);
router.get("/me", authController.protect, viewController.getAccount);
router.get("/my-tours", authController.protect, viewController.getMyTours);
router.get("/signup", (req, res) => {
	res.status(200).render("signup", {
		title: "Đăng ký",
		showButton: false,
	});
});

router.post(
	"/submit-user-data",
	authController.protect,
	viewController.updateUserData
);
module.exports = router;
