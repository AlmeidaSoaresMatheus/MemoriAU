document.getElementById('savePet').addEventListener('click', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const email = localStorage.getItem('Login');
    const type = document.getElementById('summaryType').innerText
    const sex = document.getElementById('summarySex').innerText
    const name = document.getElementById('summaryName').innerText
    const birth = document.getElementById('summaryBirthDate').innerText
    const death = document.getElementById('summaryDeathDate').innerText

    try {
        const requestBody = new URLSearchParams();
        requestBody.append('email', email);
        requestBody.append('name', name);
        requestBody.append('type', type);
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
        // this.reset(); // Limpa o formulário após o envio bem-sucedido
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register animal');
    }
});




