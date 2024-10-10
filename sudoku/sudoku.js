const board = document.getElementById('sudoku-board');
const solutionDiv = document.getElementById('solution');
let cells = [];

function createBoard() {
    board.innerHTML = ''; // Xóa bảng hiện tại
    cells = [];
    for (let i = 0; i < 9; i++) {
        cells[i] = [];
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.dataset.row = i;
            input.dataset.col = j;
            cell.appendChild(input);
            board.appendChild(cell);
            cells[i][j] = input;

            // Thêm thuộc tính dữ liệu cho khối
            const block = Math.floor(i / 3) * 3 + Math.floor(j / 3) + 1;
            cell.dataset.block = block;
        }
    }
    addBlockBorders();
    fillRandomNumbers();
}

function addBlockBorders() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (i % 3 === 0) cells[i][j].parentElement.style.borderTop = '2px solid black';
            if (j % 3 === 0) cells[i][j].parentElement.style.borderLeft = '2px solid black';
            if (i % 3 === 2) cells[i][j].parentElement.style.borderBottom = '2px solid black';
            if (j % 3 === 2) cells[i][j].parentElement.style.borderRight = '2px solid black';
        }
    }
}

function fillRandomNumbers() {
    let attempts = 0;
    while (attempts < 20) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        const num = Math.floor(Math.random() * 9) + 1;
        if (isValidNumber(num, row, col)) {
            cells[row][col].value = num;
            cells[row][col].disabled = true;
            attempts++;
        }
    }
}

function checkSolution() {
    let isValid = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!isValidNumber(cells[i][j].value, i, j)) {
                isValid = false;
                cells[i][j].style.backgroundColor = 'red';
            } else {
                cells[i][j].style.backgroundColor = 'white';
            }
        }
    }
    if (isValid) {
        alert('Congratulations! You solved the Sudoku.');
    } else {
        alert('There are errors in your solution.');
    }
}

function isValidNumber(value, row, col) {
    if (value < 1 || value > 9 || isNaN(value)) return false;
    for (let i = 0; i < 9; i++) {
        if (i !== col && cells[row][i].value == value) return false;
        if (i !== row && cells[i][col].value == value) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if ((i !== row || j !== col) && cells[i][j].value == value) return false;
        }
    }
    return true;
}

function showSolution() {
    solutionDiv.innerHTML = '<h2>Solution</h2>';
    for (let i = 0; i < 9; i++) {
        let row = document.createElement('div');
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('span');
            cell.textContent = cells[i][j].value || '';
            cell.style.display = 'inline-block';
            cell.style.width = '40px';
            cell.style.height = '40px';
            cell.style.textAlign = 'center';
            cell.style.lineHeight = '40px';
            cell.style.border = '1px solid #000';
            row.appendChild(cell);
        }
        solutionDiv.appendChild(row);
    }
    solutionDiv.style.display = 'block';
}

function hideSolution() {
    solutionDiv.style.display = 'none';
}

function saveImage() {
    html2canvas(board).then(canvas => {
        const link = document.createElement('a');
        link.download = 'sudoku.png'; // Tên tệp hình ảnh
        link.href = canvas.toDataURL('image/png'); // Chuyển đổi canvas thành hình ảnh
        link.click(); // Bắt đầu tải xuống hình ảnh
    }).catch(err => {
        console.error('Error saving image:', err); // In ra lỗi nếu có
    });
}

function newGame() {
    createBoard(); // Tạo bảng Sudoku mới
}

window.onload = createBoard; // Tạo bảng Sudoku khi trang được tải
