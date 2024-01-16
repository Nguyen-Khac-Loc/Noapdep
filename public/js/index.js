import "@babel/polyfill";
import { scrollFunction, scrollToTop, showAlert, toggleForms, changeActiveState } from "./misc";
import { login, logout, forgotPassword, signup, deleteAccount } from "./authen";
import { updateData, deleteReview, updateReview } from "./updateData";
import { displayMap } from "./mapbox";
import { bookTour } from "./stripe";
import axios from "axios";

const mapbox = document.getElementById("map");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const bookBtn = document.getElementById("book-tour");

const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".sign-up-form");
const forgotPasswordForm = document.querySelector(".forgot-password-form");
const logoutBtn = document.querySelector(".nav__el--logout");

const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const deleteAccountBtn = document.querySelector(".btn--delete--user");
const uploadUserPhoto = document.querySelector('.form__upload');
const myReviewsBtn = document.querySelector('.my-reviews');


if (myReviewsBtn) {
	myReviewsBtn.addEventListener("click", async event => {
		event.preventDefault();
		const root = document.querySelectorAll('.user-view__form-container');
		root.forEach(function (el) {
			el.style.display = "none";
		});
		let currentPage = 1;
		const limit = 1;
		const { userId } = event.target.dataset;

		
		const fetchReviews = async (page) => {

			const { data } = await axios.get(`/api/users/${userId}/reviews?page=${currentPage}`);
			const reviews = data.data.data;
			
			const reviewsContainer = document.querySelector('.my-reviews-table');
			reviewsContainer.innerHTML = '';

			reviews.forEach(review => {
				const form = document.createElement('form');
				form.classList.add('form', 'review-form', 'login-form');


				const formHTML = `
			<label class="form__label" for="tour-name-of-review-${review._id}">Tour: ${review.tour.name}</label>
    <div class="form__group">
        <label class="form__label" for="review-${review._id}">Nhận xét</label>
        <textarea id="review-${review._id}" class="form__input" name="review" required>${review.review}</textarea>
    </div>
    <div class="form__group">
        <label class="form__label" for="rating-${review._id}">Đánh giá</label>
        <input type="number" id="rating-${review._id}" class="form__input" name="rating" value="${review.rating}" required min="1" max="5">
    </div>
    <div class="form__group">
        <button type="button" class="btn btn--small btn--green save-review">Lưu</button>
        <button type="button" class="btn btn--small delete-review">Xoá</button>
    </div>
    <br>
	
`;
				form.innerHTML = formHTML;
				reviewsContainer.appendChild(form);
				

				const btnSaveReview = form.querySelector('.save-review');
				const btnDeleteReview = form.querySelector('.delete-review');
			// 	reviewsContainer.insertAdjacentHTML('beforeend', paginationHTML);

			// 	const paginationHTML = `
			// 	<button class="pagination-prev">Previous</button>
			// 	<div class="pagination-info"></div>
			// 	<button class="pagination-next">Next</button>

			// `;
				// document.querySelector('.pagination-next').addEventListener('click', () => {
				// 	currentPage++;
				// 	fetchReviews(currentPage);
				// });

				// document.querySelector('.pagination-prev').addEventListener('click', () => {
				// 	if (currentPage > 1 && currentPage < reviews.length) {
				// 		currentPage--;
				// 		fetchReviews(currentPage);
				// 	}
				// });
				btnSaveReview.addEventListener('click', async (e) => {
					e.preventDefault();

					const reviewarea = document.getElementById(`review-${review._id}`).value;
					const ratingarea = document.getElementById(`rating-${review._id}`).value;
					await updateReview(`${review._id}`, reviewarea, ratingarea);

				});
				btnDeleteReview.addEventListener('click', async (e) => {
					e.preventDefault();
					await deleteReview(`${review._id}`);
				});


			});
		};
		await fetchReviews(currentPage);
	});
}

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
	toggleForms();
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const email = document.getElementById("login-email").value;
		const password = document.getElementById("login-password").value;
		login(email, password);
	});
}

if (signupForm) {
	signupForm.addEventListener("submit", (e) => {
		e.preventDefault();
		document.querySelector(".btn--signup").textContent = "Đang xử lý..";
		const name = document.getElementById("name").value;
		const email = document.getElementById("signup-email").value;
		const password = document.getElementById("signup-password").value;
		const confirmPassword = document.getElementById("confirmPassword").value;

		signup(name, email, password, confirmPassword);
	});
}
if (deleteAccountBtn)
	deleteAccountBtn.addEventListener("click", async () => {
		deleteAccountBtn.textContent = 'Đang xử lý..';
		await deleteAccount();
		showAlert("success", "Xoá thành công!");
		window.setTimeout(() => {
			location.assign("/");
		}, 1000);
	});

if (forgotPasswordForm) {
	forgotPasswordForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		document.querySelector(".btn--forgotpassword").textContent = "Đang xử lý..";
		const email = document.getElementById("forgot-email").value;
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
