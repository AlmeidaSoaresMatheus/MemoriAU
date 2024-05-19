document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        // Verifica se já existe um usuário com o mesmo nome
        const isUserExists = await checkUserExists(email);
        if (isUserExists) {
            alert('Usuário já cadastrado.');
            return; // Sai da função se o usuário já existe
        }

        // Se o usuário não existe, prossegue com o registro
        const requestBody = new URLSearchParams();
        requestBody.append('name', name);
        requestBody.append('email', email);
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
        else {
            const newUser = await response.json();
            addUserToList(newUser);
            goToPetSignup(newUser) 
            this.reset(); // Limpa o formulário após o envio bem-sucedido
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register user');
    }
});

async function checkUserExists(email) {
    try {
        const response = await fetch(`http://localhost:3306/api/users?email=${email}`);
        if (!response.ok) {
            throw new Error('Erro ao verificar usuário');
        }
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Erro:', error);

        return false;
    }
}

function addUserToList(user) {
    const userList = document.getElementById('userList');
    const listItem = document.createElement('li');
    listItem.textContent = `Login: ${user.email}`;
    userList.appendChild(listItem);
}

function goToPetSignup(user) {
    window.location.href = "../pet/petSignup.html"; 
    localStorage.setItem('Login', user.email);
    localStorage.setItem('Name', user.name);
}


