document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const logoutButton = document.getElementById('logout-button');

    // Proteção da página
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    // Lógica de Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/index.html';
    });

    // Função para buscar os dados da API
    const fetchMedia = async () => {
        try {
            // A rota está correta e não precisa de autenticação após a nossa última correção
            const response = await fetch('http://localhost:3000/data/media');
            if (!response.ok) throw new Error('Falha ao buscar dados da API');
            
            const mediaItems = await response.json();
            if (mediaItems.length > 0) {
                populateUI(mediaItems);
            } else {
                 document.getElementById('carousels-container').innerHTML = '<p>Nenhum conteúdo de mídia encontrado. Adicione itens através da API.</p>';
            }
        } catch (error) {
            console.error("Erro crítico ao buscar mídia:", error);
            localStorage.removeItem('authToken');
            window.location.href = '/index.html';
        }
    };

    // Função para popular a interface com os dados
    const populateUI = (mediaItems) => {
        const mainBanner = document.getElementById('main-banner');
        const bannerTitle = document.querySelector('.banner-title');
        const bannerDescription = document.querySelector('.banner-description');
        
        let featuredItem = mediaItems.find(item => item.title === "Chucky");
        if (!featuredItem) { featuredItem = mediaItems[0]; }

        // Preenche o banner
        mainBanner.style.backgroundImage = `url(${featuredItem.image})`;
        bannerTitle.textContent = featuredItem.title;
        bannerDescription.textContent = featuredItem.description;

        const mediaByGenre = mediaItems.reduce((acc, item) => {
            const genre = item.genre || 'Outros';
            if (!acc[genre]) { acc[genre] = []; }
            acc[genre].push(item);
            return acc;
        }, {});

        const carouselsContainer = document.getElementById('carousels-container');
        carouselsContainer.innerHTML = '';

        for (const genre in mediaByGenre) {
            const carouselDiv = document.createElement('div');
            carouselDiv.className = 'carousel';
            carouselDiv.innerHTML = `<h2 class="carousel-title">${genre}</h2>`;
            const row = document.createElement('div');
            row.className = 'carousel-row';
            mediaByGenre[genre].forEach(item => {
                const poster = document.createElement('div');
                poster.className = 'media-item-poster';
                poster.style.backgroundImage = `url(${item.image})`;
                poster.setAttribute('data-id', item._id);
                poster.addEventListener('click', () => {
                    window.location.href = `/details.html?id=${item._id}`;
                });
                row.appendChild(poster);
            });
            carouselDiv.appendChild(row);
            carouselsContainer.appendChild(carouselDiv);
        }
    };

    // Efeito de scroll no header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) { header.classList.add('scrolled'); } 
        else { header.classList.remove('scrolled'); }
    });

    // Inicia todo o processo ao carregar a página
    fetchMedia();
});