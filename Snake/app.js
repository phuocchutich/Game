// Khởi tạo canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Kích thước mỗi ô vuông
let snake = [{ x: 9 * box, y: 9 * box }]; // Khởi tạo rắn
let apple = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; // Khởi tạo táo
let direction = "RIGHT"; // Hướng di chuyển của rắn
let score = 0;
let gameSpeed = 200;
let gameOver = false; // Biến kiểm tra khi game kết thúc
let game;
const snakeImage = new Image();
snakeImage.src = "images/snake.png"; // Hình ảnh con rắn của bạn
const appleImage = new Image();
appleImage.src = "images/apple.png"; // Hình ảnh quả táo của bạn

// Hàm vẽ rắn - sử dụng hình ảnh rắn
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        // Vẽ từng khối của rắn
        ctx.drawImage(snakeImage, snake[i].x, snake[i].y, box, box);
    }
}

// Hàm vẽ táo
function drawApple() {
    ctx.drawImage(appleImage, apple.x, apple.y, box, box);
}

// Hàm vẽ
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa toàn bộ canvas

    drawSnake(); // Vẽ con rắn
    drawApple(); // Vẽ quả táo

    // Lấy đầu của rắn
    const head = { x: snake[0].x, y: snake[0].y };

    // Di chuyển đầu rắn theo hướng
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;

    // Thêm đầu rắn vào đầu mảng
    snake.unshift(head);

    // Kiểm tra va chạm với táo
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        apple = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; // Tạo táo mới
    } else {
        snake.pop(); // Nếu không ăn táo, rắn mất đi phần đuôi
    }

    // Kiểm tra va chạm với tường hoặc chính rắn
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        gameOver = true;
        clearInterval(game); // Dừng trò chơi khi game over
        document.getElementById("playAgainBtn").style.display = "block"; // Hiển thị nút Chơi Lại
    }

    // Hiển thị điểm số
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Điểm: " + score, box, box);
}

// Hàm kiểm tra va chạm với chính rắn
function collision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Hàm khởi động lại trò chơi
function resetGame() {
    snake = [{ x: 9 * box, y: 9 * box }];
    direction = "RIGHT";
    apple = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    score = 0;
    gameSpeed = 200;
    gameOver = false;
    document.getElementById("playAgainBtn").style.display = "none"; // Ẩn nút Chơi Lại
    clearInterval(game); // Dừng trò chơi cũ (nếu có)
    game = setInterval(draw, gameSpeed); // Bắt đầu lại trò chơi
}

// Lắng nghe sự kiện bấm phím để điều khiển rắn và chơi lại
document.addEventListener("keydown", (event) => {
    // Điều khiển hướng rắn
    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
    
    // Nhấn bất kỳ phím nào để chơi lại khi game kết thúc
    if (gameOver) {
        resetGame();
    }
});

// Khởi động trò chơi
game = setInterval(draw, gameSpeed);

// Thêm sự kiện cho nút "Chơi lại"
document.getElementById("playAgainBtn").addEventListener("click", resetGame);
