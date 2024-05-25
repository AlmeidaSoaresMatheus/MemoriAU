document.getElementById('savePet').addEventListener('click', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const emailLogin = localStorage.getItem('Login');
    const name = localStorage.getItem('SummaryName');
    const breed = localStorage.getItem('SummaryBreed');
    const sex = localStorage.getItem('SummarySex');
    const birth = localStorage.getItem('SummaryBirth');
    const death = localStorage.getItem('SummaryDeath');

    try {
        const requestBody = new URLSearchParams();
        requestBody.append('nameLogin', emailLogin);
        requestBody.append('name', name);
        requestBody.append('breed', breed);
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
        this.reset(); // Limpa o formulário após o envio bem-sucedido
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register animal');
    }
});




