document.addEventListener('DOMContentLoaded', function () {
	const menuLinks = document.querySelectorAll('.menu__list__item__link');
	const menuResponsiveImg = document.querySelectorAll('.menu_responsivo');
	const arrowHeaderResponsive = document.querySelector('.arrow_header_responsive');
	const header = document.getElementById('header');
	const sidebar = document.getElementById('sidebar');
	const overlay = document.getElementById('overlay');

	let touchstartX = 0;
	let touchendX = 0;

	function toggleClass(elements, className) {
		elements.forEach(el => el.classList.toggle(className));
	}

	function showSection(targetId) {
		document.querySelectorAll('.route').forEach(section => section.classList.add('hidden'));
		const targetSection = document.getElementById(targetId);
		if (targetSection) {
			targetSection.classList.remove('hidden');
		}
	}

	// Lida com hash na URL
	const hash = window.location.hash.substring(1);
	if (hash) {
		showSection(hash);
		setActiveLink(hash);
	}

	function setActiveLink(targetId) {
		menuLinks.forEach(link => {
			link.classList.toggle('active', link.getAttribute('data-target') === targetId);
		});
	}

	menuLinks.forEach(link => {
		link.addEventListener('click', function (event) {
			event.preventDefault();
			const targetId = link.getAttribute('data-target');
			showSection(targetId);
			setActiveLink(targetId);
			window.location.hash = targetId;
			closeSidebar();
		});
	});

	function toggleVisibility() {
		toggleClass([header, sidebar, overlay, document.body], 'hidden', 'active', 'no-scroll');
	}

	function closeSidebar() {
		header.classList.add('hidden');
		sidebar.classList.add('hidden');
		overlay.classList.remove('active');
		document.body.classList.remove('no-scroll');
		if (arrowHeaderResponsive) {
			arrowHeaderResponsive.classList.remove('active');
		}
	}

	if (menuResponsiveImg.length) {
		menuResponsiveImg.forEach(img => img.addEventListener('click', toggleVisibility));
	}

	if (arrowHeaderResponsive) {
		arrowHeaderResponsive.addEventListener('click', function () {
			toggleVisibility();
			this.classList.toggle('active');
		});
	}

	if (overlay) {
		overlay.addEventListener('click', closeSidebar);
	}

	// Event delegation for sidebar
	sidebar.addEventListener('click', closeSidebar);

	// Eventos de toque para abrir/fechar o sidebar
	document.addEventListener('touchstart', function (event) {
		touchstartX = event.changedTouches[0].screenX;
	});

	document.addEventListener('touchend', function (event) {
		touchendX = event.changedTouches[0].screenX;
		handleGesture();
	});

	function handleGesture() {
		if (touchendX < touchstartX - 50) {
			closeSidebar();
		} else if (touchendX > touchstartX + 50) {
			toggleVisibility();
		}
	}
});

function openModal() {
	document.getElementById("idModal").style.display = "flex";
}

function closeModal() {
	document.getElementById("idModal").style.display = "none";
}

window.onclick = function (event) {
	if (event.target == document.getElementById("idModal")) {
		closeModal();
	}
}

function submitDocuments() {
	closeModal();
	alert("Documentos enviados com sucesso!");
}

// Seleciona todos os elementos <select> com a classe 'select-toggle'
const selectElements = document.querySelectorAll('.select-toggle');
let openSelect = null;

selectElements.forEach(select => {
	select.addEventListener('click', function (event) {
		event.stopPropagation();
		if (openSelect && openSelect !== this) {
			openSelect.classList.remove('rotated');
		}
		this.classList.toggle('rotated');
		openSelect = this.classList.contains('rotated') ? this : null;
	});
});

// Fecha o <select> ao clicar fora
document.addEventListener('mousedown', function (event) {
	if (openSelect && !openSelect.contains(event.target)) {
		openSelect.classList.remove('rotated');
		openSelect = null;
	}
});
