let isCadastroProcessing = false; // Variável para evitar múltiplas execuções no cadastroForm

// Função para habilitar ou desabilitar o botão de envio no cadastroForm
function toggleCadastroSubmitButton() {
    const form = document.getElementById('cadastroForm');
    const submitButton = document.getElementById('cadastro-enviarBtn');
    const isValid = form.checkValidity();
    submitButton.disabled = !isValid;
    submitButton.style.background = isValid ? '#5F7336' : '#D9D9D9';
    submitButton.style.color = isValid ? '#ffff' : '#000';
}

// Função para atualizar o nome do arquivo carregado no cadastroForm
function updateCadastroFileName(input) {
    const fileNamePlaceholder = document.getElementById('cadastro-file-name-placeholder');
    const file = input.files[0];
    fileNamePlaceholder.textContent = file ? file.name : 'Tipos permitidos: .jpg, .png, .pdf, .doc';
}

// Função para lidar com o envio do formulário no cadastroForm
function submitCadastroForm(event) {
    if (isCadastroProcessing) return;
    isCadastroProcessing = true;
    event.preventDefault();
    const form = document.getElementById('cadastroForm');
    const formData = new FormData(form);

    // Imprime os dados do formulário no console
    console.log('Dados do Formulário Cadastro:');
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
        alert('Formulário de Cadastro enviado com sucesso!');

        form.reset();
        document.getElementById('cadastro-file-name-placeholder').textContent = 'Tipos permitidos: .jpg, .png, .pdf, .doc';

        toggleCadastroSubmitButton();
        isCadastroProcessing = false;
    }, 1000);
}

// Adiciona os ouvintes de eventos para o cadastroForm
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    if (form) {
        form.addEventListener('input', toggleCadastroSubmitButton);
        document.getElementById('cadastro-recibo').addEventListener('change', (e) => updateCadastroFileName(e.target));
        form.addEventListener('submit', submitCadastroForm);
    }
});
