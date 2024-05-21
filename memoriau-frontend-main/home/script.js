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
        