document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = Array.from(track.children);
    const totalCards = cards.length;
    let currentIndex = 0; 
    
    // Variáveis para o Swipe
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50; // Mínimo de pixels para considerar um swipe
    
    /**
     * Determina quantos cards devem ser visíveis
     * @returns {number} O número de cards visíveis com base na largura da tela
     */
    function getCardsPerView() {
        // Se a largura da tela for menor ou igual a 600px (mesmo valor do media query CSS)
        if (window.innerWidth <= 600) {
            return 1;
        }
        return 3; // Padrão para telas maiores
    }
    
    /**
     * Função para atualizar a visualização do carrossel
     */
    function updateCarousel() {
        const cardsPerView = getCardsPerView();
        
        // Se o currentIndex for muito grande, ajustamos para o final.
        if (currentIndex > totalCards - cardsPerView) {
             currentIndex = totalCards - cardsPerView;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        // Calcula a largura de um único card (incluindo margens)
        // Usamos o primeiro card como referência para calcular o 'passo'
        const cardWidth = cards[0].offsetWidth + (parseFloat(getComputedStyle(cards[0]).marginRight || 0) * 2);

        // O deslocamento (offset) necessário é o 'passo' multiplicado pelo índice atual.
        const offset = -currentIndex * cardWidth;

        track.style.transform = `translateX(${offset}px)`;

        // Atualiza o estado dos botões, mas apenas para telas maiores
        if (cardsPerView > 1) {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= totalCards - cardsPerView;
        }
    }

    /**
     * Função para avançar (usada no botão Next e no swipe esquerdo)
     */
    function moveToNext() {
        const cardsPerView = getCardsPerView();
        if (currentIndex < totalCards - cardsPerView) {
            currentIndex++;
        } 
        updateCarousel();
    }

    /**
     * Função para voltar (usada no botão Prev e no swipe direito)
     */
    function moveToPrev() {
        if (currentIndex > 0) {
            currentIndex--;
        }
        updateCarousel();
    }
    
    // --- Lógica de Eventos de Swipe (Toque e Mouse para simular) ---
    
    // 1. Início do Toque/Arrasto
    track.addEventListener('touchstart', (e) => {
        // Registra a posição X inicial do toque
        startX = e.touches[0].clientX;
    }, {passive: true});

    // 2. Movimento do Toque/Arrasto
    track.addEventListener('touchmove', (e) => {
        // Registra a posição X final do toque
        endX = e.touches[0].clientX;
    }, {passive: true});

    // 3. Fim do Toque/Arrasto
    track.addEventListener('touchend', () => {
        // Calcula a diferença
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            // Swipe para a esquerda (diff positivo) -> Move para o próximo card
            if (diff > 0) {
                moveToNext();
            } 
            // Swipe para a direita (diff negativo) -> Move para o card anterior
            else {
                moveToPrev();
            }
        }
        // Reseta as variáveis
        startX = 0;
        endX = 0;
    });

    // --- Atribuição de Eventos de Clique (Para telas maiores) ---
    nextBtn.addEventListener('click', moveToNext);
    prevBtn.addEventListener('click', moveToPrev);

    // --- Inicialização e Ajuste de Redimensionamento ---
    updateCarousel();

    // Adiciona um listener para recalcular o carrossel se a tela for redimensionada
    window.addEventListener('resize', updateCarousel);
});