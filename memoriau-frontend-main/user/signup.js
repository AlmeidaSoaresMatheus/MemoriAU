document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const login = formData.get('login');
    const password = formData.get('password');

    try {
        // Verifica se já existe um usuário com o mesmo nome
        const isUserExists = await checkUserExists(login);
        if (isUserExists) {
            alert('Usuário já cadastrado com esse nome.');
            return; // Sai da função se o usuário já existe
        }

        // Se o usuário não existe, prossegue com o registro
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

async function checkUserExists(login) {
    try {
        const response = await fetch(`http://localhost:3306/api/users?login=${
                       }`); // Verifica se existe um usuário com o mesmo nome
        if (!response.ok) {
            throw new Error('Erro ao verificar usuário');
        }
        const data = await response.json();
        return data.exists; // Retorna true se o usuário existe, false caso contrário
    } catch (error) {
        console.error('Erro:', error);
        return false; // Retorna false em caso de erro
    }
}
