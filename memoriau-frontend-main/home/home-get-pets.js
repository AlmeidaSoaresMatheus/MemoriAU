document.addEventListener('DOMContentLoaded', async function() {

    try {
        const email = localStorage.getItem('Login');
        var carousel = document.getElementById("petsCarousel");
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

            const response = await fetch(`${URL_DOMAIN}api/file/findFile?email=${email}&nameAnimal=${petName}`, {
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

                        card.id = `item-${petName}`;
                        card.className = 'carousel-item-pet';
                        card.innerHTML = `
                            <img src="data:image/jpeg;base64,${img.data}">
                            <div class="card-body">
                                <h5 class="card-title">${petName}</h5>
                            </div>
                        `;

                        var deleteBtn = document.createElement("button");
                        deleteBtn.className = "delete-btn";
                        deleteBtn.id = `${petInfo.name}-delete-btn`; // Corrigido de 'petInfo.name' para 'petName'
                        deleteBtn.innerText = "x";
                        deleteBtn.onclick = function(event) { 
                            event.stopPropagation(); 
                            openDeleteModal(email, petName); // Adicionado para abrir o modal de exclusão
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

openDeleteModal = (email, petName) => {
    const deleteModal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');

    // Adiciona evento de clique ao botão 'Sim' no modal
    confirmBtn.onclick = function() {
        deletePetItem(email, petName); // Chama a função de exclusão se o usuário confirmar
        deleteModal.style.display = 'none'; // Fecha o modal
    };

    // Adiciona evento de clique ao botão 'Cancelar' no modal
    cancelBtn.onclick = function() {
        deleteModal.style.display = 'none'; // Fecha o modal sem excluir o animal de estimação
    };

    deleteModal.style.display = 'block'; // Exibe o modal
};

deletePetItem = async (email, petName) => {
    try {
        const response = await fetch(`${URL_DOMAIN}api/file/delete?email=${email}&petName=${petName}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete pet');
        }

        // Remova o item do DOM após a exclusão bem-sucedida
        const petCard = document.getElementById(`item-${petName}`);
        petCard.remove();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete pet');
    }
};
