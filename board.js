// Board Rendering & Visual Effects
const Board = {
    render(board, selectedPiece, validMoves) {
        const boardEl = document.getElementById('chessBoard');
        boardEl.innerHTML = '';

        board.forEach((row, rowIndex) => {
            row.forEach((piece, colIndex) => {
                const square = this.createSquare(rowIndex, colIndex, piece, selectedPiece, validMoves);
                boardEl.appendChild(square);
            });
        });
    },

    createSquare(row, col, piece, selectedPiece, validMoves) {
        const square = document.createElement('div');
        const isLight = (row + col) % 2 === 0;
        square.className = `square ${isLight ? 'light' : 'dark'} flex items-center justify-center`;
        square.dataset.row = row;
        square.dataset.col = col;
        
        if (piece) {
            const pieceEl = document.createElement('span');
            pieceEl.className = `piece ${piece.color}`;
            pieceEl.textContent = Game.pieces[piece.color][piece.type];
            square.appendChild(pieceEl);
        }

        // Highlights
        if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
            square.classList.add('selected');
        }

        if (validMoves.some(m => m.row === row && m.col === col)) {
            square.classList.add(piece ? 'capture-move' : 'valid-move');
        }

        square.addEventListener('click', () => Game.handleSquareClick(row, col));
        return square;
    },

    animateSelection(row, col) {
        gsap.fromTo(`[data-row="${row}"][data-col="${col}"] .piece`, 
            { scale: 1 }, 
            { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
        );
    },

    createCaptureEffect(row, col) {
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const rect = square.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle fixed w-2 h-2 bg-yellow-500 rounded-full';
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            document.body.appendChild(particle);
            
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    },

    updateCapturedPieces(captured) {
        const container = document.getElementById('capturedPieces');
        container.innerHTML = '';
        
        captured.white.forEach(piece => {
            const span = document.createElement('span');
            span.className = 'text-2xl opacity-60';
            span.textContent = Game.pieces.black[piece.type];
            container.appendChild(span);
        });
    }
};