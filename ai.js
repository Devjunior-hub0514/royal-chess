// AI Controller
const AI = {
    makeMove(gameInstance) {
        const state = gameInstance.state;
        const blackPieces = [];
        
        // Find all black pieces
        state.board.forEach((row, r) => {
            row.forEach((piece, c) => {
                if (piece && piece.color === 'black') {
                    blackPieces.push({ row: r, col: c, piece });
                }
            });
        });

        if (blackPieces.length === 0) return;

        // Try to find a capturing move first (simple priority)
        let bestMove = null;
        
        for (const pieceData of blackPieces) {
            const moves = gameInstance.calculateValidMoves(pieceData.row, pieceData.col);
            
            // Prioritize captures
            const captureMoves = moves.filter(move => 
                state.board[move.row][move.col] !== null
            );
            
            if (captureMoves.length > 0) {
                bestMove = {
                    from: pieceData,
                    to: captureMoves[Math.floor(Math.random() * captureMoves.length)]
                };
                break;
            }
            
            // Store random move as fallback
            if (!bestMove && moves.length > 0) {
                bestMove = {
                    from: pieceData,
                    to: moves[Math.floor(Math.random() * moves.length)]
                };
            }
        }

        if (bestMove) {
            gameInstance.executeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
        }
    }
};