document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const login = formData.get('login');
    const password = formData.get('password');

    try {
        const requestBody = new URLSearchParams();
        requestBody.append('login', login);
        requestBody.append('password', password);

        const response = await fetch('http://localhost:3306/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Adjusted Content-Type
            }, 
            body: requestBody // Adjusted request body
        });

        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        const newUser = await response.json();
        addUserToList(newUser);
        goToPetSignup(newUser) 
        this.reset(); // Limpa o formulário após o envio bem-sucedido
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register user');
    }
});

async function getUsers() {
    try {
        const response = await fetch('http://localhost:3306/api/users'); // Faz uma requisição GET para /api/users
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários'); // Lança um erro se a requisição falhar
        }
        const data = await response.json(); // Extrai os dados da resposta
        console.log('Usuários:', data.users); // Exibe os usuários no console (pode ser tratado de outra forma)
    } catch (error) {
        console.error('Erro:', error); // Exibe o erro no console
    }
}

function addUserToList(user) {
    const userList = document.getElementById('userList');
    const listItem = document.createElement('li');
    listItem.textContent = `Login: ${user.login}`;
    userList.appendChild(listItem);
}

function goToPetSignup(user) {
    window.location.href = "../pet/petSignup.html"; // Redireciona para página2.html
    localStorage.setItem('Login', user.login);
}

