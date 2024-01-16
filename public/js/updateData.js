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