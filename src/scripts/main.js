document.addEventListener("DOMContentLoaded", function () {
	const menuLinks = document.querySelectorAll(".menu__list__item__link");
	const menuResponsiveImg = document.querySelectorAll(".menu_responsivo");
	const arrowHeaderResponsive = document.querySelector(
		".arrow_header_responsive"
	);
	const header = document.getElementById("header");
	const sidebar = document.getElementById("sidebar");
	const overlay = document.getElementById("overlay");

	let touchstartX = 0;
	let touchendX = 0;

	function showSection(targetId) {
		document.querySelectorAll(".route").forEach(function (section) {
			section.classList.add("hidden");
		});
		const targetSection = document.getElementById(targetId);
		if (targetSection) {
			targetSection.classList.remove("hidden");
		}
	}

	// Lida com hash na URL
	const hash = window.location.hash.substring(1);
	if (hash) {
		showSection(hash);
		setActiveLink(hash); // Adiciona a classe .active ao link correspondente ao hash
	}

	function setActiveLink(targetId) {
		menuLinks.forEach(function (link) {
			link.classList.remove("active");
			if (link.getAttribute("data-target") === targetId) {
				link.classList.add("active");
			}
		});
	}

	menuLinks.forEach(function (link) {
		link.addEventListener("click", function (event) {
			event.preventDefault();
			const targetId = link.getAttribute("data-target");
			showSection(targetId);
			setActiveLink(targetId); // Adiciona a classe .active ao link clicado
			// Atualiza a URL com hash
			window.location.hash = targetId;
			// Fecha o sidebar e remove a classe no-scroll
			closeSidebar();
		});
	});

	function toggleVisibility() {
		header.classList.toggle("hidden");
		sidebar.classList.toggle("hidden");
		overlay.classList.toggle("active");
		document.body.classList.toggle("no-scroll"); // Adiciona ou remove a classe no-scroll
	}

	function closeSidebar() {
		header.classList.add("hidden");
		sidebar.classList.add("hidden");
		overlay.classList.remove("active");
		document.body.classList.remove("no-scroll"); // Remove a classe no-scroll
		if (arrowHeaderResponsive) {
			arrowHeaderResponsive.classList.remove("active");
		}
	}

	if (menuResponsiveImg) {
		menuResponsiveImg.forEach(function (img) {
			img.addEventListener("click", toggleVisibility);
		});
	}

	if (arrowHeaderResponsive) {
		arrowHeaderResponsive.addEventListener("click", function () {
			toggleVisibility();
			arrowHeaderResponsive.classList.toggle("active");
		});
	}

	if (overlay) {
		overlay.addEventListener("click", closeSidebar);
	}

	// Fecha o sidebar ao clicar em qualquer item dentro dele
	sidebar.querySelectorAll("*").forEach(function (item) {
		item.addEventListener("click", closeSidebar);
	});

	// Eventos de toque para abrir/fechar o sidebar
	document.addEventListener("touchstart", function (event) {
		touchstartX = event.changedTouches[0].screenX;
	});

	document.addEventListener("touchend", function (event) {
		touchendX = event.changedTouches[0].screenX;
		handleGesture();
	});

	function handleGesture() {
		if (touchendX < touchstartX - 50) {
			// Deslizar para a esquerda - fechar sidebar
			closeSidebar();
		}
		if (touchendX > touchstartX + 50) {
			// Deslizar para a direita - abrir sidebar
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
};

function submitDocuments() {
	// Aqui você pode adicionar a lógica para submissão dos documentos
	closeModal();
	alert("Documentos enviados com sucesso!");
}

// Seleciona todos os elementos <select> com a classe 'select-toggle'
const selectElements = document.querySelectorAll(".select-toggle");
let openSelect = null;

selectElements.forEach((select) => {
	// Adiciona evento de clique para alternar a rotação
	select.addEventListener("click", function (event) {
		// Evita o comportamento padrão de rotação do select ao clicar dentro dele
		event.stopPropagation();

		if (openSelect && openSelect !== this) {
			openSelect.classList.remove("rotated");
		}
		this.classList.toggle("rotated");
		openSelect = this.classList.contains("rotated") ? this : null;
	});
});

// Adiciona evento para clique fora dos <select>
document.addEventListener("mousedown", function (event) {
	if (openSelect && !Array.from(selectElements).includes(event.target)) {
		openSelect.classList.remove("rotated");
		openSelect = null;
	}
});

document.addEventListener("DOMContentLoaded", function () {
	function updateInputClass(input) {
		if (input.value || (input.type === "file" && input.files.length > 0)) {
			input.classList.add("filled");
		} else {
			input.classList.remove("filled");
		}
	}

	const inputs = document.querySelectorAll(".form-input, .form-select");

	inputs.forEach((input) => {
		input.addEventListener("input", function () {
			updateInputClass(input);
		});
	});

	document.querySelectorAll('input[type="file"]').forEach((fileInput) => {
		fileInput.addEventListener("change", function () {
			updateInputClass(fileInput);
		});
	});
});

function showVideo() {
	document.querySelector(".play-image").classList.add("hidden");
	document.getElementById("video").classList.remove("hidden");
}
