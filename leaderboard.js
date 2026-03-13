// Leaderboard Data & Rendering
const Leaderboard = {
    data: [
        { rank: 1, name: "Magnus_Carlsen", elo: 2847, wins: 892, losses: 124, avatar: "👑" },
        { rank: 2, name: "Hikaru_Nakamura", elo: 2804, wins: 756, losses: 98, avatar: "⚡" },
        { rank: 3, name: "Fabiano_Caruana", elo: 2786, wins: 634, losses: 87, avatar: "🎯" },
        { rank: 4, name: "Ding_Liren", elo: 2762, wins: 523, losses: 76, avatar: "🐉" },
        { rank: 5, name: "Ian_Nepomniachtchi", elo: 2758, wins: 445, losses: 112, avatar: "❄️" },
        { rank: 6, name: "Alireza_Firouzja", elo: 2754, wins: 398, losses: 45, avatar: "🔥" },
        { rank: 7, name: "Wesley_So", elo: 2741, wins: 512, losses: 134, avatar: "🌟" },
        { rank: 8, name: "Levon_Aronian", elo: 2735, wins: 678, losses: 234, avatar: "🦁" }
    ],

    render() {
        const list = document.getElementById('leaderboardList');
        if (!list) return;
        
        list.innerHTML = '';
        
        this.data.forEach((player) => {
            const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(1);
            const row = document.createElement('div');
            row.className = `grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition rank-${player.rank <= 3 ? player.rank : ''}`;
            row.innerHTML = `
                <div class="col-span-2 text-center font-bold text-lg ${player.rank <= 3 ? 'text-yellow-400' : 'text-gray-400'}">
                    ${player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                </div>
                <div class="col-span-6 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl border border-yellow-900/30">
                        ${player.avatar}
                    </div>
                    <div>
                        <div class="font-bold text-white">${player.name}</div>
                        <div class="text-xs text-gray-500">${player.wins}W / ${player.losses}L</div>
                    </div>
                </div>
                <div class="col-span-2 text-center font-mono font-bold text-yellow-400">${player.elo}</div>
                <div class="col-span-2 text-center text-sm ${winRate > 80 ? 'text-green-400' : 'text-gray-400'}">${winRate}%</div>
            `;
            list.appendChild(row);
        });
    },

    updatePlayerStats() {
        // Add player to leaderboard if won
        const playerExists = this.data.find(p => p.name === "You");
        
        if (!playerExists) {
            this.data.push({
                rank: 99,
                name: "You",
                elo: 1845,
                wins: 46,
                losses: 23,
                avatar: "♔"
            });
            // Sort by ELO
            this.data.sort((a, b) => b.elo - a.elo);
            // Update ranks
            this.data.forEach((p, i) => p.rank = i + 1);
        }
    }
};