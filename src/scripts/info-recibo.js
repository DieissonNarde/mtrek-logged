let isReciboProcessing = false; // Variável para evitar múltiplas execuções no reciboForm

// Função para habilitar ou desabilitar o botão de envio no reciboForm
function toggleReciboSubmitButton() {
    const form = document.getElementById('reciboForm');
    const submitButton = document.getElementById('enviarReciboBtn');
    const isValid = form.checkValidity();
    submitButton.disabled = !isValid;
    submitButton.style.background = isValid ? '#5F7336' : '#D9D9D9';
    submitButton.style.color = isValid ? '#ffff' : '#000';
}

// Função para atualizar o nome do arquivo carregado no reciboForm
function updateReciboFileName(input) {
    const fileNamePlaceholder = document.getElementById('recibo-file-name-placeholder');
    const file = input.files[0];
    fileNamePlaceholder.textContent = file ? file.name : 'Tipos permitidos: .jpg, .png, .pdf, .doc';
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
