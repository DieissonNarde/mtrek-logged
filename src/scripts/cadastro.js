let isCadastroProcessing = false;
let isDocumentUploaded = false;

document.addEventListener("DOMContentLoaded", () => {
	const cadastroForm = document.getElementById("cadastroForm");
	const frenteInput = document.getElementById("frenteDocumento");
	const versoInput = document.getElementById("versoDocumento");

	// Campos de Nome e Sobrenome
	const nomeInput = document.getElementById("nome");
	const sobrenomeInput = document.getElementById("sobrenome");

	// Validar campos de nome e sobrenome para impedir números
	[nomeInput, sobrenomeInput].forEach((input) => {
		input.addEventListener("input", validateTextFields);
	});

	if (cadastroForm) {
		cadastroForm.addEventListener("input", toggleCadastroSubmitButton);
		document
			.getElementById("cadastro-recibo")
			.addEventListener("change", updateCadastroFileName);
		cadastroForm.addEventListener("submit", submitCadastroForm);
	}

	if (frenteInput && versoInput) {
		frenteInput.addEventListener("change", handleDocumentChange);
		versoInput.addEventListener("change", handleDocumentChange);
	}

	document.getElementById("cadastro-enviarBtn").disabled = true;
	document.getElementById("submitDocumentsBtn").disabled = true;
	document
		.getElementById("submitDocumentsBtn")
		.addEventListener("click", submitDocuments);

	window.onclick = (event) => {
		const modal = document.getElementById("idModal");
		if (event.target === modal) {
			closeModal();
		}
	};

	toggleCadastroSubmitButton();
});

// Validação dos campos de texto
function validateTextFields(event) {
	const input = event.target;
	const regex = /^[A-Za-z\s]*$/;

	if (!regex.test(input.value)) {
		input.value = input.value.replace(/[^A-Za-z\s]/g, "");
	}
}

function handleDocumentChange() {
	updateFileName(this.id);
	toggleSubmitButtonState();
	checkDocumentStatus();
}

function toggleSubmitButtonState() {
	const isFilesSelected =
		document.getElementById("frenteDocumento").files.length > 0 &&
		document.getElementById("versoDocumento").files.length > 0;

	updateButtonState("submitDocumentsBtn", isFilesSelected);
}

function checkDocumentStatus() {
	const frenteInput = document.getElementById("frenteDocumento");
	const versoInput = document.getElementById("versoDocumento");
	isDocumentUploaded =
		frenteInput.files.length > 0 && versoInput.files.length > 0;

	const loadDocumentsBtn = document.getElementById("loadDocumentsBtn");
	const submitDocumentsBtn = document.getElementById("submitDocumentsBtn");

	if (isDocumentUploaded) {
		loadDocumentsBtn.textContent = "Documento de identidade carregado";
		loadDocumentsBtn.style.background = "#5F7336";
		loadDocumentsBtn.style.color = "#fff";
		loadDocumentsBtn.style.border = "none";
		loadDocumentsBtn.disabled = true;
	} else {
		loadDocumentsBtn.textContent = "Carregar documento de identidade";
		loadDocumentsBtn.style.background = "";
		loadDocumentsBtn.style.color = "";
		loadDocumentsBtn.style.border = "";
	}

	toggleCadastroSubmitButton();
	submitDocumentsBtn.disabled = !isDocumentUploaded;
}

function toggleCadastroSubmitButton() {
	const isValid =
		document.getElementById("cadastroForm").checkValidity() &&
		isDocumentUploaded;
	const submitButton = document.getElementById("cadastro-enviarBtn");

	// Atualiza o estado do botão com base na validade do formulário
	submitButton.disabled = !isValid;
	submitButton.style.color = "#000000";
	submitButton.style.backgroundColor = isValid ? "" : "#D9D9D9";
	submitButton.style.color = isValid ? "" : "#000000";

	// Atualiza o estado de outros botões de envio, se necessário
	const otherSubmitButtons = document.querySelectorAll(
		'button[type="submit"]:not(#cadastro-enviarBtn)'
	);

	otherSubmitButtons.forEach((button) => {
		button.style.background = isValid ? "" : "#D9D9D9";
		button.style.color = isValid ? "" : "#000000";
		button.disabled = !isValid;
	});

	// Atualiza a validade dos campos obrigatórios
	const fields = ["nome", "sobrenome", "estado", "distribuidora"];
	fields.forEach((field) => {
		const el = document.getElementById(field);
		setFieldValidity(el);
	});
}

function updateCadastroFileName(event) {
	const file = event.target.files[0];
	const isFileSelected = !!file;
	const fileName = isFileSelected
		? file.name
		: "Tipos permitidos: .jpg, .png, .pdf, .doc";

	document.getElementById("cadastro-file-name-placeholder").textContent =
		fileName;

	if (event.target.id === "cadastro-recibo") {
		updateButtonState("cadastro-recibo", false);
		updateButtonState(
			"loadEnergyBillBtn",
			isFileSelected,
			"Conta de energia carregada",
			"#5F7336" // Define a cor verde quando o arquivo é carregado
		);
	} else {
		updateButtonState(
			"loadDocumentsBtn",
			isFileSelected,
			"Documento de identidade carregado"
		);
	}
}

function submitCadastroForm(event) {
	if (isCadastroProcessing) return;
	isCadastroProcessing = true;
	event.preventDefault();

	const submitBtn = document.getElementById("cadastro-enviarBtn");
	const documentsBtn = document.getElementById("loadDocumentsBtn");
	const billInput = document.getElementById("cadastro-recibo");
	const billBtn = document.getElementById("loadEnergyBillBtn");

	const frenteInput = document.getElementById("frenteDocumento");
	const versoInput = document.getElementById("versoDocumento");

	const form = event.target;
	updateButtonState("cadastro-enviarBtn", false, "Enviando...");

	console.log("Dados do Formulário Cadastro:", new FormData(form).entries());

	simulateBackendOperation(() => {
		form.reset();

		resetInput(frenteInput, "frenteDocumento");
		resetInput(versoInput, "versoDocumento");
		document.getElementById("cadastro-file-name-placeholder").textContent =
			"Tipos permitidos: .jpg, .png, .pdf, .doc";

		["frenteDocumento", "versoDocumento"].forEach((id) => updateFileName(id));

		openStep2Modal(); // Aqui você deve abrir o próximo passo do seu formulário

		submitBtn.disabled = true;
		submitBtn.textContent = "Enviar";
		submitBtn.style.backgroundColor = "";
		submitBtn.style.color = "";

		documentsBtn.disabled = false;
		documentsBtn.textContent = "Enviar documento de identidade";
		documentsBtn.style.background = "";
		documentsBtn.style.color = "";
		documentsBtn.style.border = "";

		billInput.disabled = false;

		billBtn.style.background = "";
		billBtn.style.color = "";
		billBtn.style.border = "";
		billBtn.textContent = "Carregar conta de energia";

		isCadastroProcessing = false;
		isDocumentUploaded = false;
	});
}

function simulateBackendOperation(callback) {
	setTimeout(callback, 2000);
}

function openModal() {
	document.getElementById("idModal").style.display = "flex";
}

function closeModal() {
	document.getElementById("idModal").style.display = "none";
}

function updateFileName(inputId) {
	const input = document.getElementById(inputId);
	const file = input.files[0];
	const otherInputId =
		inputId === "frenteDocumento" ? "versoDocumento" : "frenteDocumento";
	const otherInput = document.getElementById(otherInputId);
	const otherFile = otherInput.files[0];

	updateSpanAndStyles(inputId, file);
	updateSpanAndStyles(otherInputId, otherFile);

	if (areFilesEqual(file, otherFile)) {
		alert("O mesmo arquivo não pode ser selecionado para ambos os campos.");
		resetInput(input, inputId);
		resetInput(otherInput, otherInputId);
	}
}

function updateSpanAndStyles(inputId, file) {
	const span = document.getElementById(`${inputId}Name`);
	const fileName = file
		? truncateFileName(file.name)
		: "Nenhum arquivo selecionado";

	span.textContent = fileName;
	span.title = fileName;

	updateInputStyles(inputId, file);
}

function updateInputStyles(inputId, file) {
	const isFrente = inputId === "frenteDocumento";
	const imgElement = document.getElementById(
		isFrente ? "frenteImg" : "versoImg"
	);
	const labelElement = document.getElementById(
		isFrente ? "frenteLabel" : "versoLabel"
	);

	imgElement.style.border = file ? "8px solid #5F7336" : "8px solid #D9D9D9";
	labelElement.textContent = file
		? "Carregado"
		: `Enviar ${isFrente ? "Frente" : "Verso"}`;
	labelElement.style.background = file ? "#5F7336" : "";
}

function resetInput(input, inputId) {
	input.value = "";
	updateSpanAndStyles(inputId, null);
}

function resetFormAndButtons(form) {
	form.reset();

	["frenteDocumento", "versoDocumento"].forEach((id) => updateFileName(id));
	updateButtonState("loadEnergyBillBtn", false, "Carregar conta de energia");
	updateButtonState(
		"loadDocumentsBtn",
		false,
		"Carregar documento de identidade"
	);
	updateButtonState("submitDocumentsBtn", false, "Enviar");
	updateButtonState("cadastro-enviarBtn", true, "Enviar");
	isDocumentUploaded = false;
}

function updateButtonState(buttonId, isEnabled, text = null, color = null) {
	const button = document.getElementById(buttonId);

	// Habilita ou desabilita o botão
	button.disabled = !isEnabled;

	// Adiciona ou remove as classes de acordo com o estado do botão
	if (isEnabled) {
		button.disabled = false;
		button.classList.remove("button_disabled");
		button.classList.add("button_enabled");
	} else {
		button.disabled = true;
		button.classList.remove("button_enabled");
		button.classList.add("button_disabled");
	}

	// Atualiza o texto do botão, se fornecido
	if (text !== null) {
		button.textContent = text;
	}

	// Atualiza a cor do botão, se fornecida
	if (color !== null) {
		button.style.background = color;
	}
}

function setFieldValidity(el) {
	if (el) {
		const isValid = el.value.trim() !== "";
		el.setCustomValidity(isValid ? "" : "Este campo é obrigatório");
		el.style.borderColor = isValid ? "#5F7336" : "#D9D9D9";
	}
}

function areFilesEqual(file1, file2) {
	return (
		file1 && file2 && file1.name === file2.name && file1.size === file2.size
	);
}

function truncateFileName(fileName, maxLength = 30) {
	if (fileName.length > maxLength) {
		const extIndex = fileName.lastIndexOf(".");
		const extension = extIndex !== -1 ? fileName.slice(extIndex) : "";
		const truncated = fileName.slice(0, maxLength - extension.length - 3);
		return `${truncated}...${extension}`;
	}
	return fileName;
}

function openStep2Modal() {
	const step2Modal = document.getElementById("step2Modal");
	step2Modal.style.display = "flex";
}

function closeStep2Modal() {
	const step2Modal = document.getElementById("step2Modal");
	step2Modal.style.display = "none";
}
