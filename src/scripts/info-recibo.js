let isReciboProcessing = false; // Variável para evitar múltiplas execuções no reciboForm

// Função para habilitar ou desabilitar o botão de envio no reciboForm e estilizar os campos
function toggleReciboSubmitButton() {
	const form = document.getElementById('reciboForm');
	const submitButton = document.getElementById('enviarReciboBtn');
	const isValid = form.checkValidity();

	// Estiliza o botão de envio
	submitButton.disabled = !isValid;
	submitButton.style.background = isValid ? '#5F7336' : '#D9D9D9';
	submitButton.style.color = isValid ? '#ffff' : '#000';
	submitButton.style.border = isValid ? 'none' : '';

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

		form.reset();
		document.getElementById('recibo-file-name-placeholder').textContent = 'Tipos permitidos: .jpg, .png, .pdf, .doc';

		// Altera o texto do botão de upload
		const fileBtnText = document.getElementById('recibo-file-btn-text');
		if (fileBtnText) {
			fileBtnText.textContent = 'Carregar outro';
		}

		// Atualiza os estilos após o envio
		const fileBtn = document.getElementById('recibo-file-btn');
		fileBtn.style.backgroundColor = ''; // Cor roxa
		fileBtn.style.color = ''; // Texto branco
		fileBtn.style.border = '';

		toggleReciboSubmitButton();
		isReciboProcessing = false;
	}, 1000);
}

// Adiciona os ouvintes de eventos para o reciboForm
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('reciboForm');
	if (form) {
		form.addEventListener('input', toggleReciboSubmitButton);
		document.getElementById('recibo-recibo').addEventListener('change', (e) => updateReciboFileName(e.target));
		form.addEventListener('submit', submitReciboForm);
	}
});