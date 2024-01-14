import axios from "axios";
import { showAlert } from "./misc";

export const login = async (email, password) => {
	try {
		const res = await axios({
			method: "POST",
			url: "/api/users/login",
			data: {
				email,
				password,
			},
		});
		if (res.data.status === "success") {
			showAlert("success", "Đăng nhập thành công");
			window.setTimeout(() => {
				location.assign("/");
			}, 1000);
		}
	} catch (err) {
		showAlert("error", err.response.data.message);
	}
};
export const signup = async (name, email, password, confirmPassword) => {
	try {
		const res = await axios({
			method: "POST",
			url: "/api/users/signup",
			data: {
				name,
				email,
				password,
				confirmPassword,
			},
		});
		if (res.data.status === "success") {
			showAlert("success", "Đăng ký thành công.");
			window.setTimeout(() => {
				location.assign("/");
			}, 1000);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
export const logout = async () => {
	try {
		const res = await axios({
			method: "GET",
			url: "/api/users/logout",
		});
		if (res.data.status === "success") {
			showAlert("success", res.data.message);
			window.setTimeout(() => {
				location.assign("/");
			}, 1000);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};

export const deleteAccount = async () => {
	try {
		await axios({
			method: "DELETE",
			url: "/api/users/deleteme",
		});
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};

export const forgotPassword = async (email) => {
	try {
		const res = await axios({
			method: "POST",
			url: "/api/users/forgotpassword",
			data: {
				email,
			},
		});
		if (res.data.status === "success") {
			showAlert("success", res.data.message);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
