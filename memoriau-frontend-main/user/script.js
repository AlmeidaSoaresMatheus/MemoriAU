document.addEventListener('DOMContentLoaded', async () => {
    const userList = document.getElementById('userList');
    const userForm = document.getElementById('userForm');

    // Função para carregar a lista de usuários
    const loadUsers = async () => {
        userList.innerHTML = ''; // Limpa a lista antes de carregar os usuários

        const response = await fetch('../memoriau-backend-main/service/apiUserService.js');
        const data = await response.json();

        data.users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} - ${user.login}`;
            userList.appendChild(li);
        });
    };

    // Carrega a lista de usuários quando a página é carregada
    await loadUsers();

    // Event listener para o formulário de adicionar usuário
    userForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o envio padrão do formulário

        const nameUser = document.getElementById('nameUser').value;
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        // Envia os dados para o backend criar um novo usuário
        const response = await fetch('../memoriau-backend-main/service/apiUserService.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nameUser, login, password })
        });

        if (response.ok) {
            // Se a requisição for bem-sucedida, recarrega a lista de usuários
            await loadUsers();
            // Limpa os campos do formulário
            userForm.reset();
        } else {
            // Se houver um erro na requisição, exibe uma mensagem de erro
            alert('Failed to add user.');
        }
    });
});
