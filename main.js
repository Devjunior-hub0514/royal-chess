// Main Application Entry Point
const App = {
    init() {
        console.log('♔ Royal Chess Arena Initialized');
        Navigation.showHome();
        this.initBackgroundEffects();
        Network.init();
    },

    initBackgroundEffects() {
        // Floating particles
        setInterval(() => {
            if (Math.random() > 0.7) {
                const particle = document.createElement('div');
                particle.className = 'fixed w-1 h-1 bg-yellow-500/30 rounded-full pointer-events-none';
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.top = '100vh';
                document.body.appendChild(particle);
                
                gsap.to(particle, {
                    y: -window.innerHeight,
                    x: (Math.random() - 0.5) * 200,
                    duration: 10 + Math.random() * 10,
                    ease: "none",
                    onComplete: () => particle.remove()
                });
            }
        }, 2000);
    }
};

// Navigation Controller
const Navigation = {
    pages: ['homePage', 'gamePage', 'leaderboardPage'],

    hideAll() {
        this.pages.forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
    },

    showHome() {
        this.hideAll();
        document.getElementById('homePage').classList.remove('hidden');
        gsap.from('#homePage > *', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 });
    },

    showGame() {
        this.hideAll();
        document.getElementById('gamePage').classList.remove('hidden');
        Game.init();
        gsap.from('.board-container', { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.7)" });
    },

    showLeaderboard() {
        this.hideAll();
        document.getElementById('leaderboardPage').classList.remove('hidden');
        Leaderboard.render();
        gsap.from('#leaderboardList > *', { x: -30, opacity: 0, duration: 0.4, stagger: 0.05 });
    }
};

// Modal Controller
const Modal = {
    open(winner) {
        const modal = document.getElementById('gameOverModal');
        const isWinner = winner === 'white';
        
        document.getElementById('resultIcon').textContent = isWinner ? '👑' : '💀';
        document.getElementById('resultTitle').textContent = isWinner ? 'Victory!' : 'Defeat';
        document.getElementById('resultMessage').textContent = isWinner ? 
            'You defeated your opponent by checkmate!' : 
            'Your king has fallen. Train harder for the next battle.';
        
        modal.classList.remove('hidden');
        
        if (isWinner) Leaderboard.updatePlayerStats();
    },

    close() {
        document.getElementById('gameOverModal').classList.add('hidden');
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => App.init());