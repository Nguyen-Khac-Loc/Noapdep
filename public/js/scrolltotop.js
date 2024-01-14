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
