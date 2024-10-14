const board = document.getElementById('puzzle-board');
const piecesContainer = document.getElementById('pieces');
const shuffleBtn = document.getElementById('shuffle-btn');
const checkBtn = document.getElementById('check-btn');

const imageUrl = 'img/img1.jpg'; // Đường dẫn ảnh của bạn
const rows = 4;  // Số hàng
const cols = 4;  // Số cột cho mảnh ghép vuông
const pieceSize = 100; // Kích thước của mỗi mảnh ghép (hình vuông)
let pieces = [];
let correctPositions = [];
let slots = [];

// Tạo bảng lưới cho các ô ghép hình
function createBoard() {
    board.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const slot = document.createElement('div');
            slot.classList.add('slot');
            slot.style.width = `${pieceSize}px`;
            slot.style.height = `${pieceSize}px`;
            slot.style.top = `${i * pieceSize}px`;
            slot.style.left = `${j * pieceSize}px`;
            slot.dataset.row = i;
            slot.dataset.col = j;
            slot.addEventListener('dragover', allowDrop);
            slot.addEventListener('drop', dropPiece);
            slots.push(slot);
            board.appendChild(slot);
        }
    }
}

// Tạo các mảnh ghép từ hình chữ nhật nhưng mảnh ghép hình vuông
function createPieces() {
    piecesContainer.innerHTML = '';
    pieces = [];
    correctPositions = [];

    const imageWidth = pieceSize * cols;  // Chiều rộng của hình ghép hoàn chỉnh (hình chữ nhật)
    const imageHeight = pieceSize * rows; // Chiều cao của hình ghép hoàn chỉnh

    for (let i = 0; i < rows * cols; i++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        const row = Math.floor(i / cols);
        const col = i % cols;
        piece.style.width = `${pieceSize}px`;
        piece.style.height = `${pieceSize}px`;
        piece.style.backgroundImage = `url(${imageUrl})`;

        // Điều chỉnh vị trí hình ảnh trên mảnh ghép
        piece.style.backgroundSize = `${imageWidth}px ${imageHeight}px`; // Đặt kích thước ảnh theo tổng thể của bảng
        piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`; // Đặt vị trí ảnh cho từng mảnh ghép
        piece.dataset.row = row;
        piece.dataset.col = col;

        // Lưu vị trí đúng của mảnh ghép
        correctPositions.push({ row, col });

        piece.draggable = true;
        piece.addEventListener('dragstart', dragStart);

        pieces.push(piece);
        piecesContainer.appendChild(piece);
    }
}

// Xáo trộn các mảnh ghép
function shufflePieces() {
    pieces.forEach(piece => {
        const randomX = Math.random() * (piecesContainer.offsetWidth - pieceSize);
        const randomY = Math.random() * (piecesContainer.offsetHeight - pieceSize);
        piece.style.position = "absolute";
        piece.style.left = `${randomX}px`;
        piece.style.top = `${randomY}px`;
        piecesContainer.appendChild(piece);
    });
}

// Kéo và thả các mảnh ghép
let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
}

function allowDrop(e) {
    e.preventDefault(); // Cho phép thả mảnh ghép
}

function dropPiece(e) {
    e.preventDefault();
    const slot = e.target;

    if (slot.classList.contains('slot')) {
        const row = slot.dataset.row;
        const col = slot.dataset.col;

        // Di chuyển mảnh ghép vào đúng vị trí trong bảng
        draggedPiece.style.position = "absolute";
        draggedPiece.style.left = `${col * pieceSize}px`;
        draggedPiece.style.top = `${row * pieceSize}px`;
        draggedPiece.dataset.currentRow = row;
        draggedPiece.dataset.currentCol = col;
        board.appendChild(draggedPiece);
    }
}

// Kiểm tra nếu tất cả các mảnh đã được đặt đúng vị trí
function checkPuzzle() {
    let correct = true;
    pieces.forEach(piece => {
        const currentRow = piece.dataset.currentRow;
        const currentCol = piece.dataset.currentCol;
        const originalRow = piece.dataset.row;
        const originalCol = piece.dataset.col;

        if (currentRow != originalRow || currentCol != originalCol) {
            correct = false;
        }
    });

    if (correct) {
        alert("Congratulations! You've completed the puzzle!");
    } else {
        alert("Some pieces are not in the right place. Keep trying!");
    }
}

// Khởi động trò chơi
function startGame() {
    createBoard();
    createPieces();
    shuffleBtn.addEventListener('click', shufflePieces);
    checkBtn.addEventListener('click', checkPuzzle);
}

// Bắt đầu khi tải trang
window.onload = startGame;
