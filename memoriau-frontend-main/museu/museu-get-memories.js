document.addEventListener('DOMContentLoaded', async function() {

    try {
        const email = localStorage.getItem('Login');
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        const response = await fetch(`http://localhost:3306/api/file/findFileRecord?email=${email}`, {
            method: 'GET',
        });

        const data = await response.json();

        const pets = data.map(pet => pet.nameAnimal);
        const petNames = pets.filter((name, index) => pets.indexOf(name) === index);

        if (!response.ok) {
            throw new Error('Failed to find user animals');
        }

        for (let i = 0; i < petNames.length; i++) {
            const petName = petNames[i]

            const response = await fetch(`http://localhost:3306/api/file/findFile?email=${email}&nameAnimal=${petName}`, {
                method: 'GET',
            });

            const images = await response.json();
                images.forEach(img => {
                    if (img.data.trim() !== "") {
                        const card = document.createElement('div');
                        const keyParts = img.key.split('/');
                        const petName = keyParts[1];
                        const dateAndImageName = keyParts[3];
                        const description = keyParts[2];
                        const date = dateAndImageName.substring(0, 10);

                        card.className = 'gallery';
                        card.innerHTML = `
                            <img src="data:image/jpeg;base64,${img.data}">
                            <div class="card-body">
                                <h5 class="card-title">${petName}</h5>
                                <p class="card-text">${description}</p>
                                <h6 class="card-text">${date}</h6>
                            </div>
                        `;
                        gallery.appendChild(card);
                    }
                });
        }
    } catch (error) {
        console.error('Error:', error);
    } 

});

