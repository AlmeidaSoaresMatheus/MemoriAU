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
            const petName = petNames[i];

            const petButton = document.getElementById('petButton');

            const button = document.createElement('div');
            button.className = 'petButton';
            button.id = 'choosePet';
            button.innerHTML = `
                <button class="button-body-${petName}" onclick="displayTimeLine('${petName}', '${petNames}')">${petName}</button>
            `;
            petButton.appendChild(button);

            const response = await fetch(`${URL_DOMAIN}api/timeline/searchTimeline?email=${email}&nameAnimal=${petName}`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            if (response.status === 401 || response.status === 403) {
                checkToken();
            }

            const timelineData = await response.json();

            for (let j = 0; j < timelineData.length; j++) {
                const item = timelineData[j];

                const { descriptionFile, date, image } = item;

                if (image.trim() !== "") {
                    const card = document.createElement('div');

                    card.className = `gallery card-body-${petName}`;
                    card.style.display = 'none'; // oculta por padrão
                    card.innerHTML = `
                        <img src="data:image/jpeg;base64,${image}">
                        <div class="card-body">
                            <h5 class="card-title">${descriptionFile}</h5>
                            <h6 class="card-text">Date: ${new Date(date).toLocaleDateString()}</h6>
                        </div>
                    `;
                    gallery.appendChild(card);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } 
});

function displayTimeLine(petName, petNames) {
    // Mostra apenas a linha do tempo do pet selecionado
    const pets = petNames.split(',');
    
    const petNameList = pets.filter(name => name !== petName);

    for (let i = 0; i < petNameList.length; i++) {
        const name = petNameList[i]

        const timelineToHidden = document.getElementsByClassName(`card-body-${name}`);
        for (let i = 0; i < timelineToHidden.length; i++) {
            timelineToHidden[i].style.display = 'none'; // oculta todas as linhas do tempo
        }
    }

    const timelineToShow = document.getElementsByClassName(`card-body-${petName}`);

    if (timelineToShow.length > 0) {
        for (let i = 0; i < timelineToShow.length; i++) {
            timelineToShow[i].style.display = 'block'; // oculta todas as linhas do tempo
        }
    }
}

