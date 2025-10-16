document.addEventListener('DOMContentLoaded', () => {
    // PASSO 1: Proteger a página, assim como na página 'browse'
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Se não houver token, o usuário não deveria estar aqui. Redireciona para o login.
        window.location.href = 'index.html';
        return;
    }

    // PASSO 2: Adicionar funcionalidade de clique ao perfil principal
    const mainProfile = document.getElementById('main-profile');

    mainProfile.addEventListener('click', () => {
        // Ao clicar no perfil, redireciona para a página de navegação
        window.location.href = '/browse.html';
    });


});