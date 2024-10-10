const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");

let score = 0;
let board = [];
let startX, startY; // Lưu vị trí bắt đầu của cú nhấp chuột

function initializeGame() {
    score = 0;
    scoreDisplay.innerText = "Điểm: " + score;
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    updateGrid();
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }
    if (emptyCells.length) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateGrid() {
    grid.innerHTML = '';
    board.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.innerText = value > 0 ? value : '';
            cell.style.backgroundColor = getCellColor(value);
            grid.appendChild(cell);
        });
    });
    scoreDisplay.innerText = "Điểm: " + score;
}

function getCellColor(value) {
    switch (value) {
        case 0: return "#eee4da";
        case 2: return "#eee4da";
        case 4: return "#ede0c8";
        case 8: return "#f2b179";
        case 16: return "#f59563";
        case 32: return "#f67c5f";
        case 64: return "#f67c5f";
        case 128: return "#edcf72";
        case 256: return "#edcc61";
        case 512: return "#edc850";
        case 1024: return "#edc53f";
        case 2048: return "#edc22e";
        default: return "#3c3a32";
    }
}

function slideAndCombine(direction) {
    let moved = false;
    let newBoard = JSON.parse(JSON.stringify(board));

    for (let i = 0; i < 4; i++) {
        let row = [];
        for (let j = 0; j < 4; j++) {
            const r = direction === 'up' || direction === 'down' ? j : i;
            const c = direction === 'up' || direction === 'down' ? i : j;

            if (newBoard[r][c] !== 0) {
                row.push(newBoard[r][c]);
            }
        }

        if (direction === 'left' || direction === 'up') {
            row = combineTiles(row);
        } else {
            row.reverse();
            row = combineTiles(row).reverse();
        }

        while (row.length < 4) {
            row.push(0);
        }

        for (let j = 0; j < 4; j++) {
            const r = direction === 'up' || direction === 'down' ? j : i;
            const c = direction === 'up' || direction === 'down' ? i : j;

            if (newBoard[r][c] !== row[j]) {
                moved = true;
            }
            newBoard[r][c] = row[j];
        }
    }

    if (moved) {
        board = newBoard;
        addRandomTile();
        updateGrid();
    }
}

function combineTiles(row) {
    for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1] && row[j] !== 0) {
            row[j] *= 2;
            score += row[j];
            row[j + 1] = 0;
        }
    }
    return row.filter(num => num !== 0);
}

// Xử lý di chuyển bằng chuột
grid.addEventListener("mousedown", (event) => {
    startX = event.clientX; // Lưu lại tọa độ X khi bắt đầu nhấn chuột
    startY = event.clientY; // Lưu lại tọa độ Y khi bắt đầu nhấn chuột
});

grid.addEventListener("mouseup", (event) => {
    const endX = event.clientX; // Lấy tọa độ X khi thả chuột
    const endY = event.clientY; // Lấy tọa độ Y khi thả chuột

    // Tính khoảng cách di chuyển theo X và Y
    const diffX = endX - startX;
    const diffY = endY - startY;

    // Xác định hướng dựa trên khoảng cách di chuyển
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            slideAndCombine('right'); // Di chuyển sang phải
        } else {
            slideAndCombine('left'); // Di chuyển sang trái
        }
    } else {
        if (diffY > 0) {
            slideAndCombine('down'); // Di chuyển xuống
        } else {
            slideAndCombine('up'); // Di chuyển lên
        }
    }
});

restartButton.addEventListener("click", initializeGame);

// Bắt đầu trò chơi
initializeGame();
