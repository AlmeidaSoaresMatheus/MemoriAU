document.getElementById('saveMemory').addEventListener('click', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const email = localStorage.getItem('Login');
    const description = document.getElementById('imageDescription').value;
    const petName = document.getElementById('imagePetName').value;
    const date = document.getElementById('imageDate').value;
    const inputFile = document.getElementById('imageFile');

    try {
        const formData = new FormData();
  
        // Adicione os dados do formulário ao objeto FormData
        formData.append('email', email);
        formData.append('petName', petName);
        formData.append('date', date);
        formData.append('description', description);
        formData.append('image', inputFile.files[0]);

        const response = await fetch(`${URL_DOMAIN}api/file/uploadImage`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to register memory');
        }

        location.reload();

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register memory');
    }
});

function uploadImagem() {
    const input = document.getElementById('imagemInput');
    const listaImagens = document.getElementById('listaImagens');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '300px';
            listaImagens.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}
