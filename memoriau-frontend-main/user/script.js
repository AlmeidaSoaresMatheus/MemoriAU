document.addEventListener('DOMContentLoaded', async function() {
    await getUsers(); // Exibe a lista de usuários ao carregar a página
});

document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const login = formData.get('login');
    const password = formData.get('password');

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });
        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        const newUser = await response.json();
        addUserToList(newUser);
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
