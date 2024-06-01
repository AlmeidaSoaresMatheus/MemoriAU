document.addEventListener('DOMContentLoaded', async function() {

    try {
        const email = localStorage.getItem('Login');
        var carousel = document.getElementById("petsCarousel");
        carousel.innerHTML = '';

        const response = await fetch(`http://localhost:3306/api/pets/find?email=${email}`, {
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

            const response = await fetch(`http://localhost:3306/api/file/findFile?email=${email}&nameAnimal=${petName}`, {
                method: 'GET',
            });

            const images = await response.json();
                images.forEach(img => {
                    if (img.data.trim() !== "") {
                        const card = document.createElement('div');
                        const keyParts = img.key.split('/');
                        if (keyParts[2] !== "profilePet") {
                            return;
                        }
                        const petName = keyParts[1];

                        card.className = 'carousel-item';
                        card.innerHTML = `
                            <img src="data:image/jpeg;base64,${img.data}">
                            <div class="card-body">
                                <h5 class="card-title">${petName}</h5>
                            </div>
                        `;

                        var deleteBtn = document.createElement("button");
                        deleteBtn.className = "delete-btn";
                        deleteBtn.id = `${petInfo.name}-delete-btn`;
                        deleteBtn.innerText = "x";
                        deleteBtn.onclick = function(event) { 
                            event.stopPropagation(); 
                            deletePetItem(newItem);
                        };
                        card.appendChild(deleteBtn);

                        carousel.appendChild(card);
                    }
                });
        }
    } catch (error) {
        console.error('Error:', error);
    } 

});

