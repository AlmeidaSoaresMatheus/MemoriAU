document.addEventListener('DOMContentLoaded', async function() {

    try {
        const email = localStorage.getItem('Login');
        const gallery = document.getElementById('gallery');
        const token = localStorage.getItem('authToken');
        gallery.innerHTML = '';

        const response = await fetch(`${URL_DOMAIN}api/file/findFileRecord?email=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 401 || response.status === 403) {
            checkToken();
        }

        const data = await response.json();

        const pets = data.map(pet => pet.nameAnimal);
        const petNames = pets.filter((name, index) => pets.indexOf(name) === index);

        if (!response.ok) {
            throw new Error('Failed to find user animals');
        }

        for (let i = 0; i < petNames.length; i++) {
            const petName = petNames[i]

            const response = await fetch(`${URL_DOMAIN}api/file/findFile?email=${email}&nameAnimal=${petName}`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            if (response.status === 401 || response.status === 403) {
                checkToken();
            }

            const images = await response.json();
                images.forEach(img => {
                    if (img.data.trim() !== "") {
                        const card = document.createElement('div');
                        const keyParts = img.key.split('/');
                        if (keyParts[2] == "profilePet") {
                            return;
                        }
                        const petName = keyParts[1];
                        const dateAndImageName = keyParts[3];
                        const description = keyParts[2];
                        const date = dateAndImageName.substring(0, 10);

                        card.id = `memory-${petName}`;
                        card.className = 'gallery';
                        card.innerHTML = `
                            <img src="data:image/jpeg;base64,${img.data}">
                            <div class="card-body">
                                <h5 class="card-title">${petName}</h5>
                                <p class="card-text">${description}</p>
                                <h6 class="card-text" >${date}</h6>
                            </div>
                        `;
                        var deleteBtn = document.createElement("button");
                        deleteBtn.className = "delete-btn";
                        deleteBtn.id = `${petName}-delete-btn`;
                        deleteBtn.innerText = "x";
                        deleteBtn.onclick = function(event) { 
                            event.stopPropagation(); 
                            deletePetItem(email, petName, description);
                        };
                        card.appendChild(deleteBtn);

                        gallery.appendChild(card);
                    }
                });
        }
    } catch (error) {
        console.error('Error:', error);
    } 

});


deletePetItem = async (email, petName, description) => {
    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`${URL_DOMAIN}api/file/delete?email=${email}&petName=${petName}&description=${description}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });

        if (response.status === 401 || response.status === 403) {
            checkToken();
        }

        if (!response.ok) {
            throw new Error('Failed to delete pet');
        }

        // Remova o item do DOM após a exclusão bem-sucedida
        const petCard = document.getElementById(`memory-${petName}`);
        petCard.remove();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete pet');
    }
};



