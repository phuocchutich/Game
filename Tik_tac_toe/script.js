const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const difficultySelect = document.getElementById('difficulty');

let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner(board) {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes('') ? null : 'Tie';
}

function minimax(newBoard, player, depth) {
    const availableMoves = getAvailableMoves(newBoard);
    const winner = checkWinner(newBoard);

    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (winner === 'Tie') return { score: 0 };

    const moves = [];
    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];
        newBoard[availableMoves[i]] = player;

        let result;
        if (player === 'O') {
            result = minimax(newBoard, 'X', depth + 1);
            move.score = result.score;
        } else {
            result = minimax(newBoard, 'O', depth + 1);
            move.score = result.score;
        }

        newBoard[availableMoves[i]] = '';
        moves.push(move);

        if (depth >= 3) {
            break;
        }
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getAvailableMoves(board) {
    const availableMoves = [];
    board.forEach((cell, index) => {
        if (cell === '') {
            availableMoves.push(index);
        }
    });
    return availableMoves;
}

function aiMove() {
    const difficulty = difficultySelect.value;
    let bestMove;

    if (difficulty === 'easy') {
        const availableMoves = getAvailableMoves(gameBoard);
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        bestMove = { index: randomMove };
    } else if (difficulty === 'medium') {
        bestMove = minimax(gameBoard, 'O', 0);
    } else if (difficulty === 'hard') {
        bestMove = minimax(gameBoard, 'O', 0);
    }

    gameBoard[bestMove.index] = 'O';
    updateBoard();
    checkGameOver();
}

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = gameBoard[index];
    });
}

function checkGameOver() {
    const winner = checkWinner(gameBoard);
    if (winner) {
        isGameOver = true;
        statusText.textContent = winner === 'Tie' ? 'Hòa nhé' : `${winner} chiến thắng!`;
        if (winner !== 'Tie') {
            triggerConfetti();
        }
    } else {
        currentPlayer = 'X';
    }
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (!gameBoard[index] && !isGameOver) {
        gameBoard[index] = currentPlayer;
        updateBoard();
        checkGameOver();

        if (!isGameOver) {
            currentPlayer = 'O';
            aiMove();
        }
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameOver = false;
    statusText.textContent = '';
    updateBoard();
}
function triggerConfetti() {
    for (let i = 0; i < 10; i++) {
        confetti({
            particleCount: 50,  // Số lượng hạt pháo hoa mỗi lần
            spread: 180,          // Pháo hoa trải rộng ít hơn để tạo hiệu ứng thác nước
            origin: { x: Math.random(), y: 0 },   // Vị trí ngẫu nhiên theo chiều ngang
            gravity: 1,         // Cảm giác pháo hoa sẽ rơi xuống
            ticks: 500,         // Số lần nổ pháo hoa (có thể tùy chỉnh)
            scalar: 1,          // Kích thước của các hạt pháo hoa
            shapes: ['circle'], // Hình dạng của pháo hoa
            colors: ['#ff0000', '#ff9900', '#33cc33', '#0099ff', '#9900cc'], // Màu sắc pháo hoa
        });
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', resetGame);

resetGame();
