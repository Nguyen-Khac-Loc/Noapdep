export function scrollFunction() {
	let isScrollingDown = false;
	const btn = document.getElementById("scrollToTopBtn");

	const currentPosition =
		document.documentElement.scrollTop || document.body.scrollTop;

	if (currentPosition > 20) {
		if (!isScrollingDown) {
			// User started scrolling down
			isScrollingDown = true;
			btn.style.display = "block";
		}
	} else {
		// User scrolled back to the top
		isScrollingDown = false;
		btn.style.display = "none";
	}
}

export function scrollToTop() {
	const scrollToTop = () => {
		const currentPosition =
			document.documentElement.scrollTop || document.body.scrollTop;

		if (currentPosition > 0) {
			window.requestAnimationFrame(scrollToTop);
			window.scrollTo(0, currentPosition - currentPosition / 8);
		}
	};

	scrollToTop();
}

const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPWForm = document.querySelector('.forgot-password-form');
const lgForm = document.querySelector('.login-form-form');
const registerForm = document.querySelector('.sign-up-form');
const signupButton = document.getElementById('signup-btn');
const loginButton = document.getElementById('login-form-btn');


export function toggleForms() {
	if (forgotPWForm && forgotPasswordLink) {
		forgotPasswordLink.addEventListener('click', (e) => {
			lgForm.style.display = 'none';
			forgotPWForm.style.display = 'block';
		});
	}
	if (loginButton && lgForm) {
		loginButton.addEventListener('click', (e) => {
			e.preventDefault();
			forgotPWForm.style.display = 'none';
			registerForm.style.display = 'none';
			lgForm.style.display = 'block';
		});
	}
	if (registerForm && signupButton) {
		signupButton.addEventListener('click', (e) => {
			e.preventDefault();
			lgForm.style.display = 'none';
			forgotPWForm.style.display = 'none';
			registerForm.style.display = 'block';
		});
	}
	document.querySelector('.forgot-password-form .back-btn').addEventListener('click', function () {
		forgotPWForm.style.display = 'none';
		lgForm.style.display = 'block';
	});

	document.querySelector('.sign-up-form .back-btn').addEventListener('click', function () {
		registerForm.style.display = 'none';
		lgForm.style.display = 'block';
	});

}

export const hideAlert = () => {
	const el = document.querySelector('.alert');
	if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
	hideAlert();
	const markup = `<div class="alert alert--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hideAlert, 2500);
};
