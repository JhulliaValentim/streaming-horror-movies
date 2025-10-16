document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const messageDiv = document.getElementById('message');

    // Extrai o token da URL da página
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    resetForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;

        // Verifica se as senhas coincidem
        if (password !== passwordConfirm) {
            messageDiv.textContent = 'As senhas não coincidem.';
            messageDiv.style.color = '#e87c03';
            return;
        }

        if (!token) {
            messageDiv.textContent = 'Token de redefinição não encontrado. Por favor, solicite novamente.';
            messageDiv.style.color = '#e50914';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/user/resetpassword/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Senha redefinida com sucesso! Redirecionando para o login...';
                messageDiv.style.color = '#4CAF50';
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 3000);
            } else {
                messageDiv.textContent = `Erro: ${data.message}`;
                messageDiv.style.color = '#e87c03';
            }
        } catch (error) {
            messageDiv.textContent = 'Erro de conexão com o servidor.';
            messageDiv.style.color = '#e50914';
            console.error('Erro ao redefinir a senha:', error);
        }
    });
});