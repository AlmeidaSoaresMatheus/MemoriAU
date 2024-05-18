document.getElementById('petForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const name = formData.get('name');
    const breed = formData.get('breed');
    const size = formData.get('size');
    const color = formData.get('color');
    const sex = formData.get('sex');
    const birth = formData.get('birth');
    const death = formData.get('death');

    try {
        const requestBody = new URLSearchParams();
        const nameLogin = localStorage.getItem('Login');
        requestBody.append('nameLogin', nameLogin);
        requestBody.append('name', name);
        requestBody.append('breed', breed);
        requestBody.append('size', size);
        requestBody.append('color', color);
        requestBody.append('sex', sex);
        requestBody.append('birth', birth);
        requestBody.append('death', death);


        const response = await fetch('http://localhost:3306/api/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Adjusted Content-Type
            }, 
            body: requestBody // Adjusted request body
        });

        if (!response.ok) {
            throw new Error('Failed to register animal');
        }
        this.reset(); // Limpa o formulário após o envio bem-sucedido
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register animal');
    }
});

// async function getUsers() {
//     try {
//         const response = await fetch('http://localhost:3306/api/users'); // Faz uma requisição GET para /api/users
//         if (!response.ok) {
//             throw new Error('Erro ao buscar usuários'); // Lança um erro se a requisição falhar
//         }
//         const data = await response.json(); // Extrai os dados da resposta
//         console.log('Usuários:', data.users); // Exibe os usuários no console (pode ser tratado de outra forma)
//     } catch (error) {
//         console.error('Erro:', error); // Exibe o erro no console
//     }
// }



