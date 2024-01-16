export function scrollFunction() {
	let isScrollingDown = false;
	const btn = document.getElementById("scrollToTopBtn");

	const currentPosition =
		document.documentElement.scrollTop || document.body.scrollTop;

	if (currentPosition > 20) {
		if (!isScrollingDown) {
			isScrollingDown = true;
			btn.style.display = "block";
		}
	} else {
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

const forgotPasswordBtn = document.getElementById('forgotpassword-btn');
const forgotPWForm = document.querySelector('.forgot-password-form');
const lgForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.sign-up-form');
const signupButton = document.getElementById('signup-btn');


export function toggleForms() {
	if (forgotPasswordBtn) {
		forgotPasswordBtn.addEventListener('click', (e) => {
			lgForm.style.display = 'none';
			const html = `
			<div class="login-form" style="display:block">
    <h2 class="heading-secondary ma-bt-lg">Quên mật khẩu</h2>
    <form class="form">
        <div class="form__group"><label class="form__label" for="email">Email</label><input class="form__input ma-bt-md" id="forgot-email" type="email" placeholder="you@example.com" value="admin@legitaf.io" required="required" /><button class="btn btn--green btn--forgotpassword">Xác nhận                   </button>
            <a
                class="btn back-btn-fgpw" style="color: inherit">Quay lại</a>
        </div>
    </form>
</div>
			`;
			forgotPWForm.style.display = 'block';
			forgotPWForm.innerHTML = html;
			document.querySelector('.back-btn-fgpw').addEventListener('click', function () {
				forgotPWForm.style.display = 'none';
				lgForm.style.display = 'block';
			});

		});

	}
	if (signupButton) {
		signupButton.addEventListener('click', (e) => {
			e.preventDefault();
			lgForm.style.display = 'none';
			const html = `
			<div class="login-form" style="display:block">
    <h2 class="heading-secondary ma-bt-lg">Đăng ký</h2>
    <form class="form">
        <div class="form__group"><label class="form__label" for="email">Email</label><input class="form__input" id="signup-email" type="email" placeholder="vidu@mail.com" required="required" /></div>
        <div class="form__group"><label class="form__label" for="email">Tên</label><input class="form__input" id="name" type="text" placeholder="Nugyen Vi Du" required="required" /></div>
        <div class="form__group ma-bt-md"><label class="form__label" for="password">Mật khẩu</label><input class="form__input" id="signup-password" type="password" placeholder="••••••••" required="required" minlength="8" /></div>
        <div class="form__group ma-bt-md"><label class="form__label" for="confirmPassword">Xác nhận mật khẩu</label><input class="form__input" id="confirmPassword" type="password" placeholder="••••••••" required="required" minlength="8" /></div>
        <div class="form__group"><button class="btn btn--green btn--signup">Xác nhận</button><a class="btn back-btn-suf" style="color: inherit">Quay lại</a></div>
    </form>
</div>
			`;
			registerForm.style.display = 'block';
			registerForm.innerHTML = html;
			document.querySelector('.back-btn-suf').addEventListener('click', function () {
				forgotPWForm.style.display = 'none';
				lgForm.style.display = 'block';
				registerForm.style.display = 'none';
			});
		});
	}
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
export const changeActiveState = function (ele) {
	var navItems = document.querySelectorAll(".nav-items");
	navItems.forEach(function (el) {
		el.classList.remove("side-nav--active");
	});
	var element = ele;
	element.classList.add("side-nav--active");
};