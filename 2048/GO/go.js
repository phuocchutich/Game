const board = document.getElementById("board");
let currentColor = 'black';
const stones = []; // Lưu trữ vị trí các quân cờ

// Khởi tạo bảng cờ
function initBoard() {
    for (let i = 0; i < 19; i++) {
        const horizontalLine = document.createElement("div");
        horizontalLine.classList.add("line", "horizontal");
        horizontalLine.style.top = `${i * 30 + 15}px`;
        board.appendChild(horizontalLine);

        const verticalLine = document.createElement("div");
        verticalLine.classList.add("line", "vertical");
        verticalLine.style.left = `${i * 30 + 15}px`;
        board.appendChild(verticalLine);
    }
    board.addEventListener("click", onBoardClick);
}

// Xử lý sự kiện khi nhấp vào bảng cờ
function onBoardClick(event) {
    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const row = Math.round((y - 15) / 30);
    const col = Math.round((x - 15) / 30);

    // Kiểm tra xem vị trí đã có quân cờ chưa
    if (!document.querySelector(`.stone[data-row='${row}'][data-col='${col}']`)) {
        placeStone(row, col, 'black');
        currentColor = 'white';
        setTimeout(aiMove, 500); // AI di chuyển sau 0.5 giây
    }
}

// Đặt quân cờ vào ô
function placeStone(row, col, color) {
    const stone = document.createElement("div");
    stone.classList.add("stone", color);
    stone.style.top = `${row * 30 + 15}px`;
    stone.style.left = `${col * 30 + 15}px`;
    stone.dataset.row = row;
    stone.dataset.col = col;
    board.appendChild(stone);

    stones.push({ row, col, color });
}

// Di chuyển AI ngẫu nhiên
function aiMove() {
    const emptySquares = [];
    for (let row = 0; row < 19; row++) {
        for (let col = 0; col < 19; col++) {
            if (!document.querySelector(`.stone[data-row='${row}'][data-col='${col}']`)) {
                emptySquares.push({ row, col });
            }
        }
    }

    if (emptySquares.length > 0) {
        const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        placeStone(randomSquare.row, randomSquare.col, 'white');
        currentColor = 'black';
    }
}

initBoard();
