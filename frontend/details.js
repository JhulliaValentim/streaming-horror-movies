document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    // Pega o ID da mídia da URL
    const urlParams = new URLSearchParams(window.location.search);
    const mediaId = urlParams.get('id');

    if (!mediaId) {
        // Se não houver ID, volta para a navegação
        window.location.href = '/browse.html';
        return;
    }

    // Função para buscar os dados de um item específico
    const fetchMediaDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/data/media/${mediaId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Item não encontrado');
            const mediaDetails = await response.json();
            populateDetailsPage(mediaDetails);
            fetchRelatedContent(mediaDetails.genre, mediaDetails._id);
        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
            window.location.href = '/browse.html';
        }
    };

    // Função para preencher a página com os dados
    const populateDetailsPage = (details) => {
        document.querySelector('.details-hero').style.backgroundImage = `url(${details.image})`;
        document.querySelector('.details-title').textContent = details.title;
        document.querySelector('.details-rating').textContent = `Nota: ${details.rating}`;
        // Pega apenas o ano da data de lançamento
        const year = new Date(details.release_date).getFullYear();
        document.querySelector('.details-year').textContent = year;
        document.querySelector('.details-description').textContent = details.description;
    };

    // Função para buscar e exibir conteúdo relacionado
    const fetchRelatedContent = async (genre, currentId) => {
        const response = await fetch('http://localhost:3000/data/media', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const allMedia = await response.json();

        // Filtra por mesmo gênero, mas exclui o item atual
        const related = allMedia.filter(item => item.genre === genre && item._id !== currentId);

        const relatedGrid = document.getElementById('related-grid');
        related.forEach(item => {
            const poster = document.createElement('div');
            poster.className = 'media-item-poster';
            poster.style.backgroundImage = `url(${item.image})`;
            poster.addEventListener('click', () => {
                window.location.href = `/details.html?id=${item._id}`;
            });
            relatedGrid.appendChild(poster);
        });
    };

    // Inicia o processo
    fetchMediaDetails();
});