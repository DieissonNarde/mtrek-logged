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

// Lógica do modal
// Função para abrir o modal
function openModal() {
    document.getElementById("idModal").style.display = "flex";
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("idModal").style.display = "none";
}

// Função para verificar se os arquivos são iguais
function areFilesEqual(file1, file2) {
    return file1 && file2 && file1.name === file2.name && file1.size === file2.size;
}

// Função para atualizar o nome do arquivo no modal
function updateFileName(inputId) {
    const input = document.getElementById(inputId);
    const fileNameSpan = document.getElementById(`${inputId}Name`);
    const file = input.files[0];
    const fileName = file ? file.name : 'Nenhum arquivo selecionado';
    fileNameSpan.textContent = fileName;
    fileNameSpan.title = fileName; // Atualiza o título para o tooltip

    // Verifica se o arquivo selecionado é o mesmo para o outro campo
    const otherInputId = inputId === 'frenteDocumento' ? 'versoDocumento' : 'frenteDocumento';
    const otherInput = document.getElementById(otherInputId);
    const otherFile = otherInput.files[0];

    if (areFilesEqual(file, otherFile)) {
        alert("O mesmo arquivo não pode ser selecionado para ambos os campos.");
        input.value = ''; // Limpa o arquivo selecionado
        fileNameSpan.textContent = 'Nenhum arquivo selecionado'; // Atualiza o texto do span
        fileNameSpan.title = 'Nenhum arquivo selecionado'; // Atualiza o título do tooltip
    }
}

/// Função para lidar com o envio dos documentos
function submitDocuments() {
    const frenteInput = document.getElementById('frenteDocumento');
    const versoInput = document.getElementById('versoDocumento');
    const submitButton = document.getElementById('submitDocumentsBtn');

    if (!frenteInput.files.length || !versoInput.files.length) {
        alert("Por favor, selecione tanto o documento da frente quanto o verso.");
        return;
    }

    if (areFilesEqual(frenteInput.files[0], versoInput.files[0])) {
        alert("O mesmo arquivo não pode ser selecionado para ambos os campos.");
        return;
    }

    submitButton.textContent = "Enviando..."; // Muda o texto do botão para "Enviando"
    submitButton.disabled = true; // Desabilita o botão para evitar múltiplos cliques

    const form = document.getElementById('documentForm');
    const formData = new FormData(form);

    // Imprime os arquivos no console
    console.log('Documentos Enviados:');
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
        alert('Documentos enviados com sucesso!');
        submitButton.textContent = "Enviar"; // Restaura o texto do botão
        submitButton.disabled = false; // Habilita o botão novamente

        form.reset();
        updateFileName('frenteDocumento');
        updateFileName('versoDocumento');
        closeModal();
    }, 2000); // Ajuste o tempo de simulação se necessário
}

// Fecha o modal se clicar fora dele
window.onclick = function (event) {
    if (event.target == document.getElementById("idModal")) {
        closeModal();
    }
}
