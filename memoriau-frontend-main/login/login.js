document.getElementById('user-login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const requestBody = new URLSearchParams();
        requestBody.append('email', email);
        requestBody.append('password', password);

        const response = await fetch(`${URL_DOMAIN}api/users/verifyLogin`, {
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

function goToHome(user) {
    window.location.href = "../home/home.html"; 
    localStorage.setItem('Login', user.email);
    localStorage.setItem('Name', user.name);
}

document.getElementById('signup').addEventListener('click', function() {
    const delay = 2000;

    setTimeout(function() {
        window.location.href = '../signup/signup.html';
    }, delay);
});
