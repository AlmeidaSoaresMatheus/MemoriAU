document.getElementById('user-login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const requestBody = new URLSearchParams();
        requestBody.append('email', email);
        requestBody.append('password', password);

        const response = await fetch('http://localhost:3306/api/users/verifyLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Adjusted Content-Type
            }, 
            body: requestBody 
        });

        if (!response.ok) {
            throw new Error('Failed to find user');
            // flagLoginError()
        }
        else {
            const newUser = await response.json();
            // addUserToList(newUser);
            goToHome(newUser) 
            this.reset(); // Limpa o formulário após o envio bem-sucedido
        }
    } catch (error) {
        console.error('Error:', error);
        flagLoginError()
        // alert('Failed to find user');
    }
});

function flagLoginError() {
    const flag = document.getElementById('flag');
    const parentDiv = flag.parentNode;
    const listItem = document.createElement('p');
    listItem.textContent = `email e/ou senha não existe.`;
    parentDiv.replaceChild(listItem, flag);
}



// async function checkUserExists(email) {
//     try {
//         const response = await fetch(`http://localhost:3306/api/users?email=${email}`);
//         if (!response.ok) {
//             throw new Error('Erro ao verificar usuário');
//         }
//         const data = await response.json();
//         return data.exists;
//     } catch (error) {
//         console.error('Erro:', error);

//         return false;
//     }
// }




