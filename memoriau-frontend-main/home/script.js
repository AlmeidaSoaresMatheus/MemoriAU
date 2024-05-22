// Função para abrir o modal
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        // Função para fechar o modal
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Variáveis para armazenar informações do pet
        let petType = '';
        let petGender = '';
        let petBirthDate = '';
        let petDeathDate = '';
        let petName = '';
        let petImage = '';

        // Função para selecionar o tipo de pet
        function selectPet(type) {
            petType = type;
            closeModal('addPetModal');
            openModal('selectGenderModal');
        }

        // Função para selecionar o gênero do pet
        function selectGender(gender) {
            petGender = gender;
            closeModal('selectGenderModal');
            openModal('selectDateModal');
        }

        // Função para avançar para a etapa de adicionar o nome do pet
        function showNameModal() {
            petBirthDate = document.getElementById('birthDate').value;
            petDeathDate = document.getElementById('deathDate').value;
            closeModal('selectDateModal');
            openModal('petNameModal');
        }

        // Função para avançar para a etapa de upload da imagem do pet
        function showImageUploadModal() {
            petName = document.getElementById('petName').value;
            closeModal('petNameModal');
            openModal('uploadImageModal');
        }

        // Função para salvar as informações do pet e exibir o resumo
        function savePetInfo() {
            const fileInput = document.getElementById('petImage');
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                petImage = e.target.result;
                document.getElementById('summaryType').innerText = petType;
                document.getElementById('summaryGender').innerText = petGender;
                document.getElementById('summaryName').innerText = petName;
                document.getElementById('summaryBirthDate').innerText = petBirthDate;
                document.getElementById('summaryDeathDate').innerText = petDeathDate;
                document.getElementById('summaryImage').src = petImage;
                closeModal('uploadImageModal');
                openModal('petSummaryModal');
            };
            
            if (file) {
                reader.readAsDataURL(file);
            }
        }

        // Abre o modal de adicionar pet ao clicar no botão
        document.getElementById('addPetButton').onclick = function() {
            openModal('addPetModal');
        };
        function savePet() {
            const petSelect = document.getElementById('petSelect');
            const memoryImage = document.getElementById('summaryImage').files[0];
            const petName = petSelect.options[petSelect.selectedIndex].text;
        
            if (petName && petImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newPet = document.createElement('div');
                    newPet.classList.add('carousel-item');
                    newPet.innerHTML = `
                        <img src="${e.target.result}" alt="Pet Image">
                        <div>
                            <p><strong>Nome:</strong> ${petName}</p>
                        </div>
                    `;
                    document.querySelector('.carousel').appendChild(newPet);
                    closeModal('petModal');
                };
                reader.readAsDataURL(petImage);
            } else {
                alert('Por favor, preencha todos os campos e selecione uma imagem.');
            }
        } 
        var currentPetIndex = null;

        function addPetToCarousel() {
            var carousel = document.getElementById("petsCarousel");
        
            var newItem = document.createElement("div");
            newItem.className = "carousel-item";
        
            var img = document.createElement("img");
            img.src = petInfo.image;
            newItem.appendChild(img);
        
            var name = document.createElement("p");
            name.innerText = petInfo.name;
            newItem.appendChild(name);
        
            newItem.onclick = function() {
                editPet(petInfo, carousel.children.length - 1);
            };
        
            carousel.appendChild(newItem);
        
            petSummaryModal.style.display = "none";
        }
        
        function editPet(pet, index) {
            currentPetIndex = index;
            petInfo = pet;
            
            document.getElementById("petName").value = pet.name;
            document.getElementById("birthDate").value = pet.birthDate;
            document.getElementById("deathDate").value = pet.deathDate;
            
            addPetModal.style.display = "none";
            selectGenderModal.style.display = "none";
            selectDateModal.style.display = "none";
            petNameModal.style.display = "block";
        }
        
        function savePetInfo() {
            var imageFile = document.getElementById("petImage").files[0];
            if (imageFile) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    petInfo.image = e.target.result;
                    displaySummary();
                }
                reader.readAsDataURL(imageFile);
            } else {
                alert("Por favor, adicione uma imagem.");
            }
        }
        
        function displaySummary() {
            document.getElementById("summaryType").innerText = petInfo.type;
            document.getElementById("summaryGender").innerText = petInfo.gender;
            document.getElementById("summaryName").innerText = petInfo.name;
            document.getElementById("summaryBirthDate").innerText = petInfo.birthDate;
            document.getElementById("summaryDeathDate").innerText = petInfo.deathDate;
            document.getElementById("summaryImage").src = petInfo.image;
        
            uploadImageModal.style.display = "none";
            petSummaryModal.style.display = "block";
        }
        
        function deletePet() {
            var carousel = document.getElementById("petsCarousel");
            carousel.removeChild(carousel.children[currentPetIndex]);
            petSummaryModal.style.display = "none";
        }
        
        function closeModal(modalId) {
            var modal = document.getElementById(modalId);
            modal.style.display = "none";
        }
        
