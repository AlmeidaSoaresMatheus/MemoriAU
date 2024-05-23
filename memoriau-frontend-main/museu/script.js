// scripts.js
function uploadImagem() {
    const input = document.getElementById('imagemInput');
    const listaImagens = document.getElementById('listaImagens');

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '300px';
            listaImagens.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}
