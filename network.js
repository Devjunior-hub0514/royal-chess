// Network & Connection Simulation
const Network = {
    isConnected: false,
    updateInterval: null,

    init() {
        this.updateStatus();
    },

    toggleConnection() {
        this.isConnected = !this.isConnected;
        this.updateStatus();
        
        if (this.isConnected) {
            this.startLiveUpdates();
        } else {
            this.stopLiveUpdates();
        }
    },

    updateStatus() {
        const statusEl = document.getElementById('connectionStatus');
        
        if (this.isConnected) {
            statusEl.innerHTML = '<span class="status-dot status-online"></span><span class="text-green-400">Online</span>';
        } else {
            statusEl.innerHTML = '<span class="status-dot status-offline"></span><span>Offline</span>';
        }
    },

    startLiveUpdates() {
        // Simulate live player count
        this.updateInterval = setInterval(() => {
            const players = document.getElementById('onlinePlayers');
            const games = document.getElementById('activeGames');
            
            if (!players || !games) return;
            
            const currentPlayers = parseInt(players.textContent.replace(',', ''));
            const currentGames = parseInt(games.textContent);
            
            players.textContent = (currentPlayers + Math.floor(Math.random() * 10 - 5)).toLocaleString();
            games.textContent = Math.max(1, currentGames + Math.floor(Math.random() * 4 - 2));
        }, 3000);
    },

    stopLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
};