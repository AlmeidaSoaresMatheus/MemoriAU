// Função para enviar a imagem e outros dados para a API
async function enviarDadosParaAPI() {
    // Obtenha a referência para os campos do formulário
    const inputFile = document.getElementById('inputFile');
    const emailInput = document.getElementById('email');
    const petNameInput = document.getElementById('petName');
    const dateInput = document.getElementById('date');
    const descriptionInput = document.getElementById('description');
  
    // Verifique se todos os campos necessários estão preenchidos
    if (!inputFile.files[0] || !emailInput.value || !petNameInput.value || !dateInput.value || !descriptionInput.value) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
  
    try {
      // Crie um novo objeto FormData
      const formData = new FormData();
  
      // Adicione os dados do formulário ao objeto FormData
      formData.append('email', emailInput.value);
      formData.append('petName', petNameInput.value);
      formData.append('date', dateInput.value);
      formData.append('description', descriptionInput.value);
      formData.append('file', inputFile.files[0]);
  
      // Faça uma requisição POST para a API com os dados do formulário
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
  
      // Verifique se a requisição foi bem-sucedida
      if (response.ok) {
        alert('Imagem enviada com sucesso!');
        // Limpe os campos do formulário após o envio bem-sucedido
        emailInput.value = '';
        petNameInput.value = '';
        dateInput.value = '';
        descriptionInput.value = '';
        inputFile.value = '';
      } else {
        // Caso contrário, exiba uma mensagem de erro
        alert('Erro ao enviar imagem!');
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao enviar imagem. Por favor, tente novamente mais tarde.');
    }
  }
  
  // Adicione um event listener para o envio do formulário
  document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o comportamento padrão de enviar o formulário
    enviarDadosParaAPI(); // Chama a função para enviar os dados para a API
  });
  