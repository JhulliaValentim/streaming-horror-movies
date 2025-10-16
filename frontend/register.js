document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Registro bem-sucedido! Redirecionando para o login...';
                messageDiv.style.color = '#4CAF50';
                setTimeout(() => {
                    window.location.href = '/index.html'; // Redireciona para o login
                }, 2000);
            } else {
                messageDiv.textContent = `Erro: ${data.message}`;
                messageDiv.style.color = '#e87c03';
            }
        } catch (error) {
            messageDiv.textContent = 'Erro de conexão. O servidor parece estar offline.';
            messageDiv.style.color = '#e50914';
            console.error('Erro ao tentar registrar:', error);
        }
    });
});