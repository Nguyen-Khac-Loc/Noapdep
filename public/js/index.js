import "@babel/polyfill";
import { scrollFunction, scrollToTop } from "./scrolltotop";
import { login, logout, forgotPassword, signup, deleteAccount } from "./authen";
import { updateData } from "./updateData";
import { displayMap } from "./mapbox";
import { bookTour } from "./stripe";
import { showAlert } from "./alert";

const mapbox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const forgotPasswordForm = document.querySelector(".form--forgotpassword");
const bookBtn = document.getElementById("book-tour");
const logoutBtn = document.querySelector(".nav__el--logout");
const deleteAccountBtn = document.querySelector(".btn--delete--user");
const uploadUserPhoto = document.querySelector('.form__upload');

if (uploadUserPhoto) {
	uploadUserPhoto.addEventListener('change', (e) => {
		const previews = document.getElementById('previewimage');
		if (e.target.files.length === 0)
			previews.innerHTML = '';
		else {
			const file = e.target.files;;
			const reader = new FileReader();
			reader.readAsDataURL(file[0]);
			reader.addEventListener('load', (e) => {
				previews.innerHTML = '';
				let div = document.createElement('div');
				div.innerHTML = `			
				<div style="display: flex; align-items: center;">
						<img src="${e.target.result}" style="width: 100px; margin-right: 10px;">
						<p>${file[0].name}</p>			  
					</div>`;
				previews.append(div);
			});
		}
	});
}
if (scrollToTopBtn) {
	window.onscroll = function () {
		scrollFunction();
	};
	scrollToTopBtn.addEventListener("click", scrollToTop);
}
if (mapbox) {
	const locations = JSON.parse(
		document.getElementById("map").dataset.locations
	);
	displayMap(locations);
}

if (loginForm) {
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		login(email, password);
	});
}

if (signupForm) {
	signupForm.addEventListener("submit", (e) => {
		e.preventDefault();
		document.querySelector(".btn--signup").textContent = "Đang xử lý..";
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const confirmPassword = document.getElementById("confirmPassword").value;

		signup(name, email, password, confirmPassword);
	});
}
if (deleteAccountBtn)
	deleteAccountBtn.addEventListener("click", async () => {
		await deleteAccount();
		showAlert("success", "Xoá thành công");
		window.setTimeout(() => {
			location.assign("/");
		}, 1000);
	});

if (forgotPasswordForm) {
	forgotPasswordForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		document.querySelector(".btn--forgotpassword").textContent = "Đang xử lý..";

		const email = document.getElementById("email").value;
		await forgotPassword(email);
		document.querySelector(".btn--forgotpassword").textContent = "Xác nhận";
	});
}
if (logoutBtn) logoutBtn.addEventListener("click", logout);

if (userDataForm) {
	userDataForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const form = new FormData();
		form.append("name", document.getElementById("name").value);
		form.append("email", document.getElementById("email").value);
		form.append("photo", document.getElementById("photo").files[0]);
		updateData(form, "info");
	});
}

if (userPasswordForm) {
	userPasswordForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		document.querySelector(".btn--save--password").textContent = "Đang lưu..";

		const passwordCurrent = document.getElementById("password-current").value;
		const password = document.getElementById("password").value;
		const confirmPassword = document.getElementById("password-confirm").value;
		await updateData(
			{ passwordCurrent, password, confirmPassword },
			"password"
		);

		document.querySelector(".btn--save--password").textContent = "Lưu";
		document.getElementById("password-current").value = "";
		document.getElementById("password").value = "";
		document.getElementById("password-confirm").value = "";
	});
}

if (bookBtn) {
	bookBtn.addEventListener("click", (e) => {
		e.target.textContent = "Đang xử lý..";
		const { tourId } = e.target.dataset;
		bookTour(tourId);
	});
}
