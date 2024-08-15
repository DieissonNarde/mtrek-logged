let isCadastroProcessing = false;
let isDocumentUploaded = false;

document.addEventListener('DOMContentLoaded', () => {
	const cadastroForm = document.getElementById('cadastroForm');
	const frenteInput = document.getElementById('frenteDocumento');
	const versoInput = document.getElementById('versoDocumento');

	if (cadastroForm) {
		cadastroForm.addEventListener('input', toggleCadastroSubmitButton);
		document.getElementById('cadastro-recibo').addEventListener('change', updateCadastroFileName);
		cadastroForm.addEventListener('submit', submitCadastroForm);
	}

	if (frenteInput && versoInput) {
		frenteInput.addEventListener('change', handleDocumentChange);
		versoInput.addEventListener('change', handleDocumentChange);
	}

	document.getElementById('cadastro-enviarBtn').disabled = true;

	document.getElementById('submitDocumentsBtn').disabled = true;
	document.getElementById('submitDocumentsBtn').addEventListener('click', submitDocuments);

	// Fecha o modal quando clicar fora dele
	window.onclick = (event) => {
		const modal = document.getElementById("idModal");
		if (event.target === modal) {
			closeModal();
		}
	};
});

function handleDocumentChange() {
	updateFileName(this.id);
	toggleSubmitButtonState();
	checkDocumentStatus();
}

function toggleSubmitButtonState() {
	const isFilesSelected = document.getElementById('frenteDocumento').files.length > 0 &&
		document.getElementById('versoDocumento').files.length > 0;

	updateButtonState('submitDocumentsBtn', isFilesSelected);
}

function checkDocumentStatus() {
	const frenteInput = document.getElementById('frenteDocumento');
	const versoInput = document.getElementById('versoDocumento');
	const isDocumentUploaded = frenteInput.files.length > 0 && versoInput.files.length > 0;

	const loadDocumentsBtn = document.getElementById('loadDocumentsBtn');
	const submitDocumentsBtn = document.getElementById('submitDocumentsBtn');

	if (isDocumentUploaded) {
		loadDocumentsBtn.textContent = 'Documento de identidade carregado';
		loadDocumentsBtn.style.background = '#5F7336';
		loadDocumentsBtn.style.color = '#ffff';
		loadDocumentsBtn.style.border = 'none';
	} else {
		loadDocumentsBtn.textContent = 'Carregar documento de identidade';
		loadDocumentsBtn.style.background = '';
		loadDocumentsBtn.style.color = '';
		loadDocumentsBtn.style.border = '';
	}

	toggleCadastroSubmitButton();
	submitDocumentsBtn.disabled = !isDocumentUploaded;
}


function toggleCadastroSubmitButton() {
	const isValid = document.getElementById('cadastroForm').checkValidity() && isDocumentUploaded;
	const submitButtons = document.querySelectorAll('button[type="submit"]');

	submitButtons.forEach(button => {
		button.style.background = isValid ? '' : '#D9D9D9';
		button.style.color = isValid ? '' : '#000000';
		button.disabled = !isValid;
	});

	const fields = ['nome', 'sobrenome', 'estado', 'distribuidora'];
	fields.forEach(field => {
		const el = document.getElementById(field);
		setFieldValidity(el);
	});
}


function updateCadastroFileName(event) {
	const file = event.target.files[0];
	const isFileSelected = !!file;
	const fileName = isFileSelected ? file.name : 'Tipos permitidos: .jpg, .png, .pdf, .doc';

	document.getElementById('cadastro-file-name-placeholder').textContent = fileName;
	updateButtonState('loadEnergyBillBtn', isFileSelected, 'Conta de energia carregada', 'Carregar conta de energia');
}

function submitCadastroForm(event) {
	if (isCadastroProcessing) return;
	isCadastroProcessing = true;
	event.preventDefault();

	const submitBtn = document.getElementById('cadastro-enviarBtn')
	const documentsBtn = document.getElementById('loadDocumentsBtn')
	const BillBtn = document.getElementById('loadEnergyBillBtn')

	const form = event.target;
	const idForm = document.getElementById('documentForm')
	updateButtonState('cadastro-enviarBtn', false, 'Enviando...');

	console.log('Dados do Formulário Cadastro:', new FormData(form).entries());

	simulateBackendOperation(() => {
		form.reset();

		['frenteDocumento', 'versoDocumento'].forEach(id => updateFileName(id));

		openStep2Modal(); // Aqui você deve abrir o próximo passo do seu formulário

		submitBtn.textContent = "Enviar"

		documentsBtn.textContent = "Enviar documento de identidade"
		documentsBtn.style.background = ""
		documentsBtn.disabled = false

		BillBtn.textContent = "Carregar conta de energia"
		BillBtn.style.background = ""
		BillBtn.disabled = false

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
	const otherInputId = inputId === 'frenteDocumento' ? 'versoDocumento' : 'frenteDocumento';
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
	const fileName = file ? truncateFileName(file.name) : 'Nenhum arquivo selecionado';

	span.textContent = fileName;
	span.title = fileName;

	updateInputStyles(inputId, file);
}

function updateInputStyles(inputId, file) {
	const isFrente = inputId === 'frenteDocumento';
	const imgElement = document.getElementById(isFrente ? 'frenteImg' : 'versoImg');
	const labelElement = document.getElementById(isFrente ? 'frenteLabel' : 'versoLabel');

	imgElement.style.border = file ? '8px solid #5F7336' : '8px solid #D9D9D9';
	labelElement.style.background = file ? '#5F7336' : '';
	labelElement.style.color = file ? '#ffff' : '';
	labelElement.style.border = file ? 'none' : '';
	labelElement.textContent = file ? 'Carregado' : `Enviar ${isFrente ? 'Frente' : 'Verso'}`;
}

function resetInput(input, inputId) {
	input.value = '';
	updateSpanAndStyles(inputId, null);
}

// Remove a função duplicada toggleSubmitButtonState()

function submitDocuments(event) {
	event.preventDefault();

	const form = event.target;
	const frenteInput = document.getElementById('frenteDocumento');
	const versoInput = document.getElementById('versoDocumento');

	// Verifica se os arquivos foram selecionados ANTES de enviar
	if (!frenteInput.files.length || !versoInput.files.length) {
		alert("Por favor, selecione tanto o documento da frente quanto o verso.");
		return; // Impede o envio do formulário se não houver arquivos
	}

	if (areFilesEqual(frenteInput.files[0], versoInput.files[0])) {
		alert("O mesmo arquivo não pode ser selecionado para ambos os campos.");
		return; // Impede o envio se os arquivos forem iguais
	}

	updateButtonState('submitDocumentsBtn', false, "Enviando...");

	console.log('Documentos Enviados:', new FormData(form).entries());

	simulateBackendOperation(() => {
		alert('Documentos enviados com sucesso!');
		updateButtonState('loadDocumentsBtn', true, 'Documento de identidade carregado');
		resetFormAndButtons(form);
		closeModal();
	});
}

function resetFormAndButtons(form) {
	form.reset();

	['frenteDocumento', 'versoDocumento'].forEach(id => updateFileName(id));
	updateButtonState('loadEnergyBillBtn', false, 'Carregar conta de energia');
	// Mantém o estado do botão "Carregar documento de identidade"
	// updateButtonState('loadDocumentsBtn', false, 'Carregar documento de identidade'); 
	updateButtonState('submitDocumentsBtn', false, 'Enviar');
	updateButtonState('cadastro-enviarBtn', true, 'Enviar');
	isDocumentUploaded = false;
}

function updateButtonState(buttonId, isEnabled, text = null) {
	const button = document.getElementById(buttonId);

	button.disabled = !isEnabled;
	button.style.background = isEnabled ? '#5F7336' : '#D9D9D9';
	button.style.color = isEnabled ? '#ffffff' : '#000000';
	button.style.border = isEnabled ? 'none' : '';

	if (text !== null) button.textContent = text;
}

function setFieldValidity(el) {
	if (el) {
		const isValid = el.value.trim() !== '';
		el.setCustomValidity(isValid ? '' : 'Este campo é obrigatório');
		el.style.borderColor = isValid ? '#5F7336' : '#D9D9D9';

	}
}

function areFilesEqual(file1, file2) {
	return file1 && file2 && file1.name === file2.name && file1.size === file2.size;
}

function truncateFileName(fileName, maxLength = 30) {
	if (fileName.length > maxLength) {
		const extIndex = fileName.lastIndexOf('.');
		const extension = extIndex !== -1 ? fileName.slice(extIndex) : '';
		const truncated = fileName.slice(0, maxLength - extension.length - 3);
		return `${truncated}...${extension}`;
	}
	return fileName;
}

// Adicione esta função para abrir o próximo passo do formulário
function openStep2Modal() {
	const step2modal = document.getElementById("step2Modal");

	step2modal.style.display = "flex";
}

function closeStep2Modal() {
	const step2modal = document.getElementById("step2Modal");

	step2modal.style.display = "none";
}