// Aguarda o carregamento completo do conteúdo da página para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do HTML com os quais vamos interagir
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    // Adiciona um "ouvinte" para o evento de 'submit' (envio) do formulário
    loginForm.addEventListener('submit', async (event) => {
        // Previne o comportamento padrão do formulário, que é recarregar a página
        event.preventDefault();

        // Pega os valores digitados pelo usuário nos campos de email e senha
        const email = emailInput.value;
        const password = passwordInput.value;

        // Tenta executar a comunicação com a API
        try {
            // Realiza a requisição POST para a API, exatamente como fizemos no Thunder Client
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    // Informa ao servidor que estamos enviando dados em formato JSON
                    'Content-Type': 'application/json',
                },
                // Converte nosso objeto JavaScript em uma string JSON para envio
                body: JSON.stringify({ email, password }),
            });

            // Converte a resposta da API de JSON para um objeto JavaScript
            const data = await response.json();

            // Verifica se a requisição foi bem-sucedida (status 200-299)
            // Dentro do loginForm.addEventListener('submit', ...)

            if (response.ok) {
             // Salva o token no localStorage do navegador
                localStorage.setItem('authToken', data.token);

                messageDiv.textContent = 'Login bem-sucedido! Redirecionando...';
                messageDiv.style.color = '#4CAF50';

             // Aguarda 1 segundo e redireciona para a nova página de navegação
                setTimeout(() => {
                    window.location.href = '/profiles.html';
               }, 1000);
            } else {
                // Se a API retornou um erro (ex: senha incorreta), exibe a mensagem de erro
                messageDiv.textContent = `Erro: ${data.message}`;
                messageDiv.style.color = '#e87c03'; // Laranja/amarelo para erro
            }
        } catch (error) {
            // Se houver um erro de rede (ex: API offline), exibe uma mensagem genérica
            messageDiv.textContent = 'Erro de conexão. O servidor parece estar offline.';
            messageDiv.style.color = '#e50914'; // Vermelho para erro grave
            console.error('Erro ao tentar fazer login:', error);
        }
    });
});