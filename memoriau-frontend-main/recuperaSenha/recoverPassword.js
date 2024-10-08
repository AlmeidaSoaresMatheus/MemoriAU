document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const messageElement = document.getElementById('message');
    const criteriaElement = document.getElementById('passwordCriteria');

    const validatePassword = (password) => {
        const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordStrengthRegex.test(password);
    };

    if (!validatePassword(newPassword)) {
        criteriaElement.style.display = 'block';
        return;
    } 

    criteriaElement.style.display = 'none';

    try {
        const requestBody = new URLSearchParams();
        const urlParams = new URLSearchParams(window.location.search);
        requestBody.append('token',  urlParams.get('token'));
        requestBody.append('newPassword', newPassword);
       
        const response = await fetch( `${URL_DOMAIN}api/resetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
        } else {
            const errorMessage = response.status === 401 
                ? 'Token inválido. Por favor, solicite um novo e-mail de recuperação de senha.'
                : 'Erro ao redefinir a senha. Tente novamente.';
            
            messageElement.textContent = errorMessage;
            messageElement.style.color = 'red';
        }
    } catch (error) {
        messageElement.textContent = 'Erro ao redefinir a senha. Tente novamente.';
        messageElement.style.color = 'red';
    }
});
