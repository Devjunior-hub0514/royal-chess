// Game State & Logic
const Game = {
    state: {
        board: [],
        selectedPiece: null,
        validMoves: [],
        turn: 'white',
        moveHistory: [],
        capturedPieces: { white: [], black: [] },
        isActive: false,
        timers: { white: 600, black: 600 }
    },

    pieces: {
        white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
        black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
    },

    init() {
        this.initBoard();
        Board.render(this.state.board, this.state.selectedPiece, this.state.validMoves);
        this.startTimers();
        this.state.isActive = true;
        this.state.turn = 'white';
        this.state.moveHistory = [];
        this.state.capturedPieces = { white: [], black: [] };
        this.updateMoveHistory();
        Board.updateCapturedPieces(this.state.capturedPieces);
    },

    initBoard() {
        const setup = [
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
        ];

        this.state.board = setup.map((row, rowIndex) => 
            row.map((piece, colIndex) => {
                if (!piece) return null;
                const color = rowIndex < 2 ? 'black' : 'white';
                return { type: piece, color, hasMoved: false };
            })
        );
    },

    handleSquareClick(row, col) {
        if (!this.state.isActive) return;

        const piece = this.state.board[row][col];

        // If clicking a valid move destination
        if (this.state.selectedPiece && 
            this.state.validMoves.some(m => m.row === row && m.col === col)) {
            this.executeMove(this.state.selectedPiece.row, this.state.selectedPiece.col, row, col);
            return;
        }

        // If clicking own piece
        if (piece && piece.color === this.state.turn) {
            this.state.selectedPiece = { row, col };
            this.state.validMoves = this.calculateValidMoves(row, col);
            Board.render(this.state.board, this.state.selectedPiece, this.state.validMoves);
            Board.animateSelection(row, col);
        } else {
            this.state.selectedPiece = null;
            this.state.validMoves = [];
            Board.render(this.state.board, null, []);
        }
    },

    calculateValidMoves(row, col) {
        const piece = this.state.board[row][col];
        if (!piece) return [];

        const moves = [];
        const direction = piece.color === 'white' ? -1 : 1;

        switch(piece.type) {
            case 'pawn':
                // Forward
                if (!this.state.board[row + direction]?.[col]) {
                    moves.push({ row: row + direction, col });
                    if (!piece.hasMoved && !this.state.board[row + 2 * direction]?.[col]) {
                        moves.push({ row: row + 2 * direction, col });
                    }
                }
                // Captures
                [-1, 1].forEach(offset => {
                    const target = this.state.board[row + direction]?.[col + offset];
                    if (target && target.color !== piece.color) {
                        moves.push({ row: row + direction, col: col + offset });
                    }
                });
                break;

            case 'rook':
                [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dr, dc]) => {
                    for (let i = 1; i < 8; i++) {
                        const newRow = row + dr * i;
                        const newCol = col + dc * i;
                        if (!this.isValidPosition(newRow, newCol)) break;
                        const target = this.state.board[newRow][newCol];
                        if (!target) {
                            moves.push({ row: newRow, col: newCol });
                        } else {
                            if (target.color !== piece.color) moves.push({ row: newRow, col: newCol });
                            break;
                        }
                    }
                });
                break;

            case 'knight':
                [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]].forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isValidPosition(newRow, newCol)) {
                        const target = this.state.board[newRow][newCol];
                        if (!target || target.color !== piece.color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });
                break;

            case 'bishop':
                [[1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
                    for (let i = 1; i < 8; i++) {
                        const newRow = row + dr * i;
                        const newCol = col + dc * i;
                        if (!this.isValidPosition(newRow, newCol)) break;
                        const target = this.state.board[newRow][newCol];
                        if (!target) {
                            moves.push({ row: newRow, col: newCol });
                        } else {
                            if (target.color !== piece.color) moves.push({ row: newRow, col: newCol });
                            break;
                        }
                    }
                });
                break;

            case 'queen':
                [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
                    for (let i = 1; i < 8; i++) {
                        const newRow = row + dr * i;
                        const newCol = col + dc * i;
                        if (!this.isValidPosition(newRow, newCol)) break;
                        const target = this.state.board[newRow][newCol];
                        if (!target) {
                            moves.push({ row: newRow, col: newCol });
                        } else {
                            if (target.color !== piece.color) moves.push({ row: newRow, col: newCol });
                            break;
                        }
                    }
                });
                break;

            case 'king':
                [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isValidPosition(newRow, newCol)) {
                        const target = this.state.board[newRow][newCol];
                        if (!target || target.color !== piece.color) {
                            moves.push({ row: newRow, col: newCol });
                        }
                    }
                });
                break;
        }

        return moves;
    },

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    },

    executeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.state.board[fromRow][fromCol];
        const target = this.state.board[toRow][toCol];

        // Capture
        if (target) {
            this.state.capturedPieces[piece.color].push(target);
            Board.updateCapturedPieces(this.state.capturedPieces);
            Board.createCaptureEffect(toRow, toCol);
        }

        // Move piece
        this.state.board[toRow][toCol] = { ...piece, hasMoved: true };
        this.state.board[fromRow][fromCol] = null;

        // Record move
        const notation = `${piece.type[0].toUpperCase()}${String.fromCharCode(97 + toCol)}${8 - toRow}`;
        this.state.moveHistory.push({
            number: Math.floor(this.state.moveHistory.length / 2) + 1,
            [this.state.turn]: notation
        });
        this.updateMoveHistory();

        // Reset selection
        this.state.selectedPiece = null;
        this.state.validMoves = [];

        // Switch turn
        this.state.turn = this.state.turn === 'white' ? 'black' : 'white';
        Board.render(this.state.board, null, []);

        // Check end conditions (simplified)
        if (Math.random() < 0.03) {
            this.endGame(this.state.turn === 'white' ? 'black' : 'white');
            return;
        }

        // AI move if offline and black's turn
        if (!Network.isConnected && this.state.turn === 'black') {
            setTimeout(() => AI.makeMove(this), 1000);
        }
    },

    updateMoveHistory() {
        const historyEl = document.getElementById('moveHistory');
        const lastMove = this.state.moveHistory[this.state.moveHistory.length - 1];
        
        if (this.state.turn === 'black' && lastMove) {
            const entry = document.createElement('div');
            entry.className = 'flex gap-4 text-gray-300';
            entry.innerHTML = `
                <span class="text-yellow-600 w-8">${lastMove.number}.</span>
                <span class="flex-1">${lastMove.white || ''}</span>
                <span class="flex-1 text-gray-400">${lastMove.black || '...'}</span>
            `;
            historyEl.appendChild(entry);
            historyEl.scrollTop = historyEl.scrollHeight;
        }
    },

    startTimers() {
        setInterval(() => {
            if (!this.state.isActive) return;
            
            if (this.state.turn === 'white') {
                this.state.timers.white--;
                document.getElementById('timerWhite').textContent = this.formatTime(this.state.timers.white);
            } else {
                this.state.timers.black--;
                document.getElementById('timerBlack').textContent = this.formatTime(this.state.timers.black);
            }

            if (this.state.timers.white <= 0 || this.state.timers.black <= 0) {
                this.endGame(this.state.timers.white <= 0 ? 'black' : 'white');
            }
        }, 1000);
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    endGame(winner) {
        this.state.isActive = false;
        Modal.open(winner);
    },

    resign() {
        if (confirm('Are you sure you want to resign?')) {
            this.endGame('black');
        }
    },

    offerDraw() {
        alert('Draw offer sent to opponent!');
        setTimeout(() => {
            if (Math.random() > 0.5) {
                alert('Opponent accepted!');
                Navigation.showHome();
            } else {
                alert('Opponent declined.');
            }
        }, 1500);
    }
};