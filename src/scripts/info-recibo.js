let isReciboProcessing = false; // Variável para evitar múltiplas execuções no reciboForm

// Função para habilitar ou desabilitar o botão de envio no reciboForm e estilizar os campos
function toggleReciboSubmitButton() {
	const form = document.getElementById('reciboForm');
	const submitButton = document.getElementById('enviarReciboBtn');
	const isValid = form.checkValidity();

	// Estiliza o botão de envio
	submitButton.disabled = !isValid;
	if (isValid) {
		submitButton.classList.remove('button_disabled');
		submitButton.classList.add('button_enabled');
	} else {
		submitButton.classList.remove('button_enabled');
		submitButton.classList.add('button_disabled');
	}

	// Estiliza os campos de entrada e selects
	const fields = ['data_envio', 'recibo-distribuidora'];
	fields.forEach(id => {
		const element = document.getElementById(id);
		if (element) {
			element.style.borderColor = isValid ? '#5F7336' : '#D9D9D9';
		}
	});
}

// Função para atualizar o nome do arquivo carregado no reciboForm e estilizar o botão de upload
function updateReciboFileName(input) {
	const fileNamePlaceholder = document.getElementById('recibo-file-name-placeholder');
	const fileBtn = document.getElementById('recibo-file-btn');
	const file = input.files[0];

	// Atualiza o texto do placeholder com o nome do arquivo ou mensagem padrão
	fileNamePlaceholder.textContent = file ? file.name : 'Tipos permitidos: .jpg, .png, .pdf, .doc';

	// Estiliza o botão de upload com base na presença de um arquivo
	fileBtn.style.backgroundColor = file ? '#5F7336' : '#D9D9D9';
	fileBtn.style.color = file ? '#fff' : '#000';
	fileBtn.style.border = file ? 'none' : '';
}

// Função para lidar com o envio do formulário no reciboForm
function submitReciboForm(event) {
	if (isReciboProcessing) return;
	isReciboProcessing = true;
	event.preventDefault();
	const form = document.getElementById('reciboForm');
	const formData = new FormData(form);

	// Imprime os dados do formulário no console
	console.log('Dados do Formulário Recibo:');
	for (const [key, value] of formData.entries()) {
		if (value instanceof File) {
			console.log(`${key}: ${value.name}`);
		} else {
			console.log(`${key}: ${value}`);
		}
	}

	// Simula a operação do backend
	setTimeout(() => {
		console.log('Simulação de envio bem-sucedido.');
		alert('Formulário de Recibo enviado com sucesso!');

		// Reseta o formulário
		form.reset();
		document.getElementById('recibo-file-name-placeholder').textContent = 'Tipos permitidos: .jpg, .png, .pdf, .doc';

		// Atualiza os estilos após o envio
		const fileBtn = document.getElementById('recibo-file-btn');
		fileBtn.style.backgroundColor = ''; // Reseta a cor do botão de upload
		fileBtn.style.color = ''; // Reseta a cor do texto do botão de upload
		fileBtn.style.border = '';

		// Reativar o botão de envio e resetar as classes
		toggleReciboSubmitButton();

		// Reativar o botão se ele for desabilitado após o reset
		const enviarBtn = document.getElementById('enviarReciboBtn');
		enviarBtn.disabled = true;
		enviarBtn.classList.remove('button_enabled');
		enviarBtn.classList.add('button_disabled');

		isReciboProcessing = false;
	}, 1000);
}

// Função para definir a data padrão no campo de data de envio
document.addEventListener("DOMContentLoaded", function () {
	const dataInput = document.getElementById("data_envio");

	if (dataInput && !dataInput.value) {
		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
		const year = today.getFullYear();

		// Formato yyyy-mm-dd (padrão para input type="date")
		dataInput.value = `${year}-${month}-${day}`;
	}
});

// Adiciona os ouvintes de eventos para o reciboForm
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('reciboForm');
	if (form) {
		form.addEventListener('input', toggleReciboSubmitButton);
		document.getElementById('recibo-distribuidora').addEventListener('change', (e) => updateReciboFileName(e.target));
		form.addEventListener('submit', submitReciboForm);
	}
});