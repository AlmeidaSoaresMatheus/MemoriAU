document.addEventListener('DOMContentLoaded', async function() {

    try {
        const email = localStorage.getItem('Login');
        var carousel = document.getElementById("imagePetName");
        carousel.innerHTML = '';

        const response = await fetch(`${URL_DOMAIN}api/pets/find?email=${email}`, {
            method: 'GET',
        });

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

