let isCadastroProcessing = false; // Variável para evitar múltiplas execuções no cadastroForm
let isDocumentUploaded = false; // Estado que indica se o documento foi carregado

document.addEventListener('DOMContentLoaded', () => {
    // Lógica do formulário de cadastro
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('input', toggleCadastroSubmitButton);
        document.getElementById('cadastro-recibo').addEventListener('change', (e) => updateCadastroFileName(e.target));
        cadastroForm.addEventListener('submit', submitCadastroForm);
    }

    // Lógica do modal para frenteDocumento e versoDocumento
    const frenteInput = document.getElementById('frenteDocumento');
    const versoInput = document.getElementById('versoDocumento');

    if (frenteInput && versoInput) {
        frenteInput.addEventListener('change', handleDocumentChange);
        versoInput.addEventListener('change', handleDocumentChange);
    }

    // Fecha o modal se clicar fora dele
    window.onclick = (event) => {
        if (event.target == document.getElementById("idModal")) {
            closeModal();
        }
    };
});

function handleDocumentChange() {
    updateFileName(this.id); // Atualiza o nome do arquivo e estilos
    toggleSubmitButtonState(); // Habilita ou desabilita o botão de enviar no modal
    checkDocumentStatus(); // Verifica se ambos os documentos foram carregados
}

// Função para verificar se ambos os documentos foram carregados
function checkDocumentStatus() {
    const frenteInput = document.getElementById('frenteDocumento');
    const versoInput = document.getElementById('versoDocumento');
    isDocumentUploaded = frenteInput.files.length > 0 && versoInput.files.length > 0;

    // Atualiza o estilo do botão "carregar documento de identidade"
    const documentBtn = document.getElementById('loadDocumentsBtn');
    documentBtn.style.background = isDocumentUploaded ? '#5F7336' : '#83217c';
    documentBtn.textContent = isDocumentUploaded ? 'Documento de identidade carregado' : 'Carregar documento de identidade';

    toggleCadastroSubmitButton(); // Verifica se o botão de envio do cadastro deve ser habilitado
}

// Função para habilitar ou desabilitar o botão de envio no cadastroForm
function toggleCadastroSubmitButton() {
    const form = document.getElementById('cadastroForm');
    const submitButton = document.getElementById('cadastro-enviarBtn');
    const isValid = form.checkValidity() && isDocumentUploaded; // Verifica o estado do formulário e do documento

    submitButton.disabled = !isValid;
    submitButton.style.background = isValid ? '#5F7336' : '#D9D9D9';
    submitButton.style.color = isValid ? '#ffffff' : '#000000';
}

// Função para atualizar o nome do arquivo carregado no cadastroForm
function updateCadastroFileName(input) {
    const fileNamePlaceholder = document.getElementById('cadastro-file-name-placeholder');
    const file = input.files[0];
    const loadEnergyBillBtn = document.getElementById('loadEnergyBillBtn');
    
    fileNamePlaceholder.textContent = file ? file.name : 'Tipos permitidos: .jpg, .png, .pdf, .doc';
    
    loadEnergyBillBtn.style.background = file ? '#5F7336' : '#83217c';
    loadEnergyBillBtn.textContent = file ? 'Conta de energia carregada' : 'Carregar conta de energia';
}

function openStep2Modal() {
    document.getElementById("step2Modal").style.display = "flex";
}

function closeStep2Modal() {
    document.getElementById("step2Modal").style.display = "none";
}

// Função para lidar com o envio do formulário no cadastroForm
function submitCadastroForm(event) {
    if (isCadastroProcessing) return;
    isCadastroProcessing = true;
    event.preventDefault();

    const form = document.getElementById('cadastroForm');
    const formData = new FormData(form);

    const submitButton = document.getElementById('cadastro-enviarBtn');

    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    submitButton.style.background = '#D9D9D9';
    submitButton.style.color = '#000000';

    console.log('Dados do Formulário Cadastro:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    simulateBackendOperation(() => {
        openStep2Modal()

        const energyBillBtn = document.getElementById('loadEnergyBillBtn');
        const documentBtn = document.getElementById('loadDocumentsBtn');

        const documentForm = document.getElementById('documentForm');

        form.reset();
        documentForm.reset()

        document.getElementById('cadastro-file-name-placeholder').textContent = 'Tipos permitidos: .jpg, .png, .pdf, .doc';

        submitButton.textContent = 'Enviar';
        submitButton.disabled = false;
        submitButton.style.background = '#83217c';
        submitButton.style.color = '#ffffff';

        energyBillBtn.textContent = 'Carregar conta de energia';
        energyBillBtn.style.background = '#83217c';

        documentBtn.textContent = 'Carregar documento de identidade';
        documentBtn.style.background = '#83217c';

        document.getElementById('cadastro-recibo').value = ''; // Reseta o valor do input de recibo

        isDocumentUploaded = false; // Reseta o estado do documento após o envio
        checkDocumentStatus(); // Atualiza o estado do botão de carregamento
        isCadastroProcessing = false;
    });
}

// Função para simular uma operação de backend
function simulateBackendOperation(callback) {
    setTimeout(() => {
        console.log('Simulação de envio bem-sucedido.');
        callback();
    }, 3000);
}

// Lógica do modal
function openModal() {
    document.getElementById("idModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("idModal").style.display = "none";
}

// Função para verificar se os arquivos são iguais
function areFilesEqual(file1, file2) {
    return file1 && file2 && file1.name === file2.name && file1.size === file2.size;
}

// Função para encurtar nomes de arquivos longos
function truncateFileName(fileName, maxLength = 30) {
    if (fileName.length > maxLength) {
        const extIndex = fileName.lastIndexOf('.');
        const extension = extIndex !== -1 ? fileName.slice(extIndex) : '';
        const truncated = fileName.slice(0, maxLength - extension.length - 3);
        return `${truncated}...${extension}`;
    }
    return fileName;
}

// Função para atualizar o nome do arquivo e os estilos no modal
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

// Função para atualizar span e estilos de input
function updateSpanAndStyles(inputId, file) {
    const fileNameSpan = document.getElementById(`${inputId}Name`);
    const fileName = file ? truncateFileName(file.name) : 'Nenhum arquivo selecionado';
    updateSpan(fileNameSpan, fileName);
    updateInputStyles(inputId, file);
}

// Função para atualizar o span com o nome do arquivo
function updateSpan(span, fileName) {
    span.textContent = fileName;
    span.title = fileName; // Atualiza o título para o tooltip
}

// Função para atualizar estilos de input e labels
function updateInputStyles(inputId, file) {
    const isFrente = inputId === 'frenteDocumento';
    const imgElement = document.getElementById(isFrente ? 'frenteImg' : 'versoImg');
    const labelElement = document.getElementById(isFrente ? 'frenteLabel' : 'versoLabel');

    imgElement.style.border = file ? '8px solid #5F7336' : '8px solid #D9D9D9';
    labelElement.style.background = file ? '#5F7336' : '#83217c';
    labelElement.textContent = file ? 'Carregado' : `Enviar ${isFrente ? 'Frente' : 'Verso'}`;
}

// Função para resetar o input e span correspondentes
function resetInput(input, inputId) {
    input.value = ''; // Limpa o arquivo selecionado
    updateSpanAndStyles(inputId, null); // Reseta os estilos e o span
}

// Função para mudar a cor do botão "Enviar" com base na seleção dos arquivos
function toggleSubmitButtonState() {
    const submitButton = document.getElementById('submitDocumentsBtn');
    const frenteInput = document.getElementById('frenteDocumento');
    const versoInput = document.getElementById('versoDocumento');

    const areBothFilesSelected = frenteInput.files.length > 0 && versoInput.files.length > 0;

    submitButton.disabled = !areBothFilesSelected;
    submitButton.style.background = areBothFilesSelected ? '#5F7336' : '#D9D9D9';
    submitButton.style.color = areBothFilesSelected ? '#ffffff' : '#000000';
}

// Função para lidar com o envio dos documentos
function submitDocuments(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    
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

    console.log('Documentos Enviados:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    simulateBackendOperation(() => {
        alert('Documentos enviados com sucesso!');
        submitButton.textContent = "Enviar"; // Restaura o texto do botão
        submitButton.disabled = false; // Habilita o botão novamente
        submitButton.style.background = '#D9D9D9'; // Reseta a cor do botão após o envio
        submitButton.style.color = '#000000';

        form.reset();
        updateFileName('frenteDocumento');
        updateFileName('versoDocumento');
        closeModal();
    });
}
