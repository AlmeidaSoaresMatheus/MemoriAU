
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("signup-form");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", function(event) {
        if (password.value !== confirmPassword.value) {
            event.preventDefault(); // Impede o envio do formulário
            errorMessage.textContent = "As senhas não coincidem. Por favor, tente novamente.";
            errorMessage.style.color = "red"; // Estiliza a mensagem de erro
        }
    });
});
