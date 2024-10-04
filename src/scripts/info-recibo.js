let isReciboProcessing = false; // Variável para evitar múltiplas execuções no reciboForm
const itemsPerPage = 4; // Número de itens por página
let currentIndex = 0; // Índice de controle para exibição de linhas

// Função para habilitar ou desabilitar o botão de envio no reciboForm e estilizar os campos
function toggleReciboSubmitButton() {
	const form = document.getElementById('reciboForm');
	const submitButton = document.getElementById('enviarReciboBtn');
	const isValid = form.checkValidity();

	// Estiliza o botão de envio
	submitButton.disabled = !isValid;
	submitButton.classList.toggle('button_disabled', !isValid);
	submitButton.classList.toggle('button_enabled', isValid);

	// Estiliza os campos de entrada e selects
	const fields = ['valor_recibo', 'recibo-distribuidora'];
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

// Função para adicionar uma nova linha à tabela com os dados do formulário
function addReciboToTable(distribuidora, valor) {
	const tableBody = document.getElementById('reciboTableBody');
	const newRow = document.createElement('tr');
	newRow.className = 'border-b border-border bg-gray-100 text-black';

	const dateCell = new Date().toLocaleDateString('pt-BR'); // Data atual

	newRow.innerHTML = `
        <td class="py-2 px-4 text-center">${distribuidora}</td>
        <td class="py-2 px-4 text-center">${dateCell}</td>
        <td class="py-2 px-4 text-center">R$ ${valor}</td>
        <td class="py-2 px-4 text-center">
            <span class="w-full h-8 inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-[#5F7336] rounded-full gap-3">
                <img src="src/assets/images/icons/Aprovado ou SelecionadoWhite.png" alt="" class="w-6">Enviado
            </span>
        </td>
    `;

	tableBody.appendChild(newRow);
	updateTableDisplay(); // Atualiza a tabela após adicionar um novo item
}

// Função para atualizar a exibição da tabela com base no índice atual
function updateTableDisplay() {
	const tableRows = document.querySelectorAll('#reciboTableBody tr');
	const noDataMessage = document.getElementById('noDataMessage');
	const verMaisBtn = document.getElementById('verMaisBtn');
	const verMenosBtn = document.getElementById('verMenosBtn');

	// Exibe apenas as linhas para a página atual
	tableRows.forEach((row, index) => {
		row.style.display = index < currentIndex + itemsPerPage ? 'table-row' : 'none';
	});

	// Controla a visibilidade dos botões "Ver Mais" e "Ver Menos"
	verMaisBtn.classList.toggle('hidden', tableRows.length <= currentIndex + itemsPerPage);
	verMenosBtn.classList.toggle('hidden', currentIndex === 0);

	// Controla a visibilidade da mensagem de "sem dados"
	noDataMessage.style.display = tableRows.length === 0 ? 'block' : 'none';
}

// Função para carregar mais linhas ao clicar em "Ver Mais"
document.getElementById('verMaisBtn').addEventListener('click', () => {
	const tableRows = document.querySelectorAll('#reciboTableBody tr');
	currentIndex += itemsPerPage;
	updateTableDisplay();

	// Oculta o botão "Ver Mais" se todas as linhas estiverem visíveis
	if (currentIndex + itemsPerPage >= tableRows.length) {
		document.getElementById('verMaisBtn').classList.add('hidden');
	}
});

// Função para voltar ao início ao clicar em "Ver Menos"
document.getElementById('verMenosBtn').addEventListener('click', () => {
	currentIndex = 0;
	updateTableDisplay();
});

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
		console.log(`${key}: ${value instanceof File ? value.name : value}`);
	}

	// Obtém os valores do formulário e adiciona à tabela
	const distribuidora = formData.get('distribuidora');
	const valor = formData.get('valor_recibo');
	addReciboToTable(distribuidora, valor);

	// Simula a operação do backend
	setTimeout(() => {
		console.log('Simulação de envio bem-sucedido.');
		alert('Formulário de Recibo enviado com sucesso!');

		// Reseta o formulário e atualiza os estilos
		form.reset();
		document.getElementById('recibo-file-name-placeholder').textContent = 'Tipos permitidos: .jpg, .png, .pdf, .doc';
		const fileBtn = document.getElementById('recibo-file-btn');
		fileBtn.style.backgroundColor = '';
		fileBtn.style.color = '';
		fileBtn.style.border = '';
		toggleReciboSubmitButton();

		// Reativa o botão de envio e aplica classes padrão
		const enviarBtn = document.getElementById('enviarReciboBtn');
		enviarBtn.disabled = true;
		enviarBtn.classList.replace('button_enabled', 'button_disabled');

		isReciboProcessing = false;
	}, 1000);
}

// Adiciona os ouvintes de eventos para o reciboForm
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('reciboForm');
	if (form) {
		form.addEventListener('input', toggleReciboSubmitButton);
		document.getElementById('recibo-distribuidora').addEventListener('change', toggleReciboSubmitButton);
		document.getElementById('recibo-recibo').addEventListener('change', (e) => updateReciboFileName(e.target));
		form.addEventListener('submit', submitReciboForm);
	}
});