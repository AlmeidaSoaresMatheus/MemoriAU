document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const email = formData.get('email');
    const name = formData.get('name');
    const password = formData.get('password');

    try {
        // Verifica se já existe um usuário com o mesmo nome
        // const isUserExists = await checkUserExists(email);
        // if (isUserExists) {
        //     alert('Usuário já cadastrado.');
        //     return; // Sai da função se o usuário já existe
        // }

        // Se o usuário não existe, prossegue com o registro
        const requestBody = new URLSearchParams();
        requestBody.append('email', email);
        requestBody.append('name', name);
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
            // addUserToList(newUser);
            goToHome(newUser) 
            this.reset(); // Limpa o formulário após o envio bem-sucedido
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register user');
    }
});

// function addUserToList(user) {
//     const userList = document.getElementById('userList');
//     const listItem = document.createElement('li');
//     listItem.textContent = `Login: ${user.email}`;
//     userList.appendChild(listItem);
// }

function goToHome(user) {
    window.location.href = "../home/home.html"; 
    localStorage.setItem('Login', user.email);
    localStorage.setItem('Name', user.name);
}

document.getElementById('login').addEventListener('click', function() {
    const delay = 2000;

    setTimeout(function() {
        window.location.href = '../login/login.html';
    }, delay);
});
