let isProcessing = false;

// Função para habilitar ou desabilitar o botão de envio
function toggleSubmitButton() {
    const form = document.getElementById('cadastroForm');
    const submitButton = document.getElementById('enviarContaBtn');
    const isValid = form.checkValidity();
    submitButton.disabled = !isValid;
    submitButton.style.background = isValid ? '#5F7336' : '#D9D9D9';
    submitButton.style.color = isValid ? '#ffff' : '#000';
}

// Função para atualizar o nome do arquivo carregado
function updateFileName(input) {
    const fileNamePlaceholder = document.getElementById('file-name-placeholder');
    const file = input.files[0];
    fileNamePlaceholder.textContent = file ? file.name : 'Tipos permitidos: .jpg, .png, .pdf, .doc';
}

// Função para lidar com o envio do formulário
function submitCadastroForm(event) {
    if (isProcessing) return; // Evita múltiplas execuções
    isProcessing = true; // Marca como processando
    event.preventDefault(); // Previne o comportamento padrão do formulário
    const form = document.getElementById('cadastroForm');
    const formData = new FormData(form);

    // Imprime os dados do formulário no console
    console.log('Dados do Formulário:');
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
        alert('Formulário enviado com sucesso!');

        // Limpa os campos do formulário
        form.reset();
        document.getElementById('file-name-placeholder').textContent = 'Tipos permitidos: .jpg, .png, .pdf, .doc';

        toggleSubmitButton(); // Reavalia o estado do botão de envio
        isProcessing = false; // Marca como não processando
    }, 1000); // Simulação de delay de 1 segundo
}

// Adiciona os ouvintes de eventos para os inputs e o formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    if (form) {
        form.addEventListener('input', toggleSubmitButton);
        document.getElementById('recibo').addEventListener('change', (e) => updateFileName(e.target));
        form.addEventListener('submit', submitForm);
    }
});



