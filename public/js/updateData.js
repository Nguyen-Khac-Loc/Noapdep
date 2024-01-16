import axios from "axios";
import { showAlert } from "./misc";

//type la pw hoac data
export const updateData = async (data, type) => {
	try {
		const url =
			type === "password"
				? "/api/users/updatemypassword"
				: "/api/users/updateme";
		const res = await axios({
			method: "PATCH",
			url,
			data,
		});
		if (res.data.status === "success") {
			showAlert("success", "Cập nhật thành công");
			location.reload();
		}
	} catch (err) {
		showAlert("error", err.response.data.message);
	}
};

export const deleteReview = async (id) => {
	try {
		const res = await axios({
			method: "DELETE",
			url: `/api/reviews/${id}`,
		});

		if (res) {
			showAlert('success', 'Đã xoá đánh giá.');
		}

	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

export const updateReview = async (id, review, rating)=>{
	try {
		const res = await axios({
			method: "PATCH",
			url: `/api/reviews/${id}`,
			data: {
				review: review,
				rating: rating,
			},
		});

		if (res.data.status === 'success') {
			showAlert('success', 'Đã sửa thành công.');
		}

	} catch (err) {
		showAlert('error', err.response.data.message);
	}
}

export const fetchReviews = async (id, container) => {

	const { data } = await axios.get(`/api/users/${id}/reviews`);
	const reviews = data.data.data;

	container.innerHTML = '';

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
		container.appendChild(form);


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