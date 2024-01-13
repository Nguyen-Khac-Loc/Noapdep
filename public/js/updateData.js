import axios from "axios";
import { showAlert } from "./alert";

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
