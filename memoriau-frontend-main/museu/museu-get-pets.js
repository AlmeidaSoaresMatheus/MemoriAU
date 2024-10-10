document.addEventListener('DOMContentLoaded', async function() {

    try {
        const email = localStorage.getItem('Login');
        const token = localStorage.getItem('authToken');

        var carousel = document.getElementById("imagePetName");
        carousel.innerHTML = '';

        const response = await fetch(`${URL_DOMAIN}api/pets/find?email=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 401 || response.status === 403) {
            checkToken();
        }

        const data = await response.json();

        const petNames = data.pets.map(pet => pet.name);
        console.log(petNames)

        if (!response.ok) {
            throw new Error('Failed to find user animals');
        }

        for (let i = 0; i < petNames.length; i++) {
            const petName = petNames[i]

            const option = document.createElement('option');

            option.value = petName
            option.innerText = petName

            carousel.appendChild(option);
        }
    } catch (error) {
        console.error('Error:', error);
    } 

});

