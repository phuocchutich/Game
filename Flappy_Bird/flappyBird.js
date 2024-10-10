const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Đường dẫn hình ảnh
const backgroundImage = new Image();
backgroundImage.src = "images/bg.png"; // Đường dẫn hình ảnh nền
const birdImage = new Image();
birdImage.src = "images/bird.png"; // Đường dẫn hình ảnh chim
const pipeImageTop = new Image();
pipeImageTop.src = "images/pipeNorth.png"; // Đường dẫn hình ảnh ống trên
const pipeImageBottom = new Image();
pipeImageBottom.src = "images/pipeSouth.png"; // Đường dẫn hình ảnh ống dưới
const groundImage = new Image();
groundImage.src = "images/fg.png"; // Đường dẫn hình ảnh mặt đất

// Tạo đối tượng âm thanh
const jumpSound = new Audio();
jumpSound.src = "sounds/fly.mp3"; // Đường dẫn đến âm thanh khi nhấn phím Space

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    velocity: 0,
    gravity: 0.5, // Thay đổi trọng lực
    jumpHeight: 8 // Chiều cao nhảy
};

let pipes = [];
let score = 0;
let isGameOver = false;
let frame = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Vẽ hình nền
    drawBird(); // Vẽ chim
    drawPipes(); // Vẽ ống
    drawGround(); // Vẽ mặt đất
    drawScore(); // Vẽ điểm số
    frame++; // Tăng khung hình

    if (isGameOver) {
        ctx.fillStyle = "black"; // Màu chữ
        ctx.font = "30px Arial"; // Kiểu chữ
        ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2 - 40); // Hiển thị thông điệp
        showRestartButton(); // Hiển thị nút chơi lại
    } else {
        requestAnimationFrame(draw); // Cập nhật khung hình tiếp theo
    }
}

function drawBird() {
    // Tính toán tốc độ chim với trọng lực
    bird.velocity += bird.gravity; 
    bird.y += bird.velocity; // Cập nhật vị trí y của chim

    // Đảm bảo chim không bay ra ngoài canvas
    if (bird.y < 0) {
        bird.y = 0; // Không cho chim bay lên trên canvas
    }
    if (bird.y + bird.height > canvas.height - 50) { // Giới hạn chim không bay xuống dưới mặt đất
        bird.y = canvas.height - 50 - bird.height; // Đặt chim ở trên mặt đất
        gameOver(); // Kết thúc trò chơi nếu chim chạm đất
    }

    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height); // Vẽ chim
}

function drawPipes() {
    // Tạo ống mới mỗi 300 khung hình để giảm tốc độ tạo ống
    if (frame % 300 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - 100)) + 50; // Chiều cao ống ngẫu nhiên
        pipes.push({ x: canvas.width, height: pipeHeight, scored: false });
    }

    // Vẽ tất cả các ống
    for (let i = 0; i < pipes.length; i++) {
        // Vẽ ống trên
        ctx.drawImage(pipeImageTop, pipes[i].x, 0, 52, pipes[i].height);
        // Vẽ ống dưới cách ống trên một khoảng pipeGap
        ctx.drawImage(pipeImageBottom, pipes[i].x, pipes[i].height + 150, 52, canvas.height - pipes[i].height - 150);

        // Giảm tốc độ di chuyển ống sang trái
        pipes[i].x -= 1; // Giảm tốc độ ống

        // Kiểm tra va chạm
        if (
            bird.x + bird.width > pipes[i].x &&
            bird.x < pipes[i].x + 52 &&
            (bird.y < pipes[i].height || bird.y + bird.height > pipes[i].height + 150)
        ) {
            gameOver(); // Kết thúc trò chơi nếu va chạm
        }

        // Tăng điểm số khi chim vượt qua ống
        if (pipes[i].x + 52 < bird.x && !pipes[i].scored) {
            score++; // Tăng điểm số
            pipes[i].scored = true; // Đánh dấu rằng đã ghi điểm
        }

        // Xóa ống khi không còn trong khung
        if (pipes[i].x + 52 < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }
}

function drawGround() {
    ctx.drawImage(groundImage, 0, canvas.height - 50, canvas.width, 50); // Vẽ mặt đất ở dưới cùng
}

function drawScore() {
    ctx.fillStyle = "black"; // Màu chữ
    ctx.font = "20px Arial"; // Kiểu chữ
    ctx.fillText("Điểm: " + score, 20, 30); // Hiển thị điểm số
}

function jump() {
    if (!isGameOver) { // Kiểm tra nếu trò chơi chưa kết thúc
        bird.velocity = -bird.jumpHeight; // Đặt vận tốc chim bằng chiều cao nhảy âm
        jumpSound.play(); // Phát âm thanh khi chim nhảy
    }
}

function gameOver() {
    isGameOver = true; // Đánh dấu trò chơi đã kết thúc
}

function showRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.innerText = "Chơi lại";
    restartButton.style.position = "absolute";
    restartButton.style.top = "50%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.style.fontSize = "24px";
    restartButton.onclick = () => location.reload(); // Tải lại trang khi nhấn nút
    document.body.appendChild(restartButton);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump(); // Gọi hàm nhảy khi nhấn phím Space
    }
});

// Bắt đầu trò chơi
draw();
