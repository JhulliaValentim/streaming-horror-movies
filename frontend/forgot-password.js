document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgot-form');
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');

    forgotForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value;

        try {
            const response = await fetch('http://localhost:3000/user/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            messageDiv.style.color = '#4CAF50'; // Verde para sucesso
            messageDiv.textContent = data.message;

        } catch (error) {
            messageDiv.style.color = '#e50914';
            messageDiv.textContent = 'Erro de conexão com o servidor.';
            console.error('Erro ao solicitar redefinição de senha:', error);
        }
    });
});