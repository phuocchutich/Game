const gameBoard = document.getElementById("game-board");
const turnsCountElem = document.getElementById("turns-count");
const restartButton = document.getElementById("restart-button");
const winOverlay = document.createElement("div");
const winMessage = document.createElement("div");
const winText = document.createElement("p");
const playAgainButton = document.createElement("button");
let turns = 0;
let flippedCards = [];
let matchedCards = 0;

// Setup win message and overlay
winOverlay.id = "win-overlay";
document.body.appendChild(winOverlay);

winMessage.id = "win-message";
winText.textContent = ""; // Placeholder for dynamic win text
winMessage.appendChild(winText);

// Play again button
playAgainButton.textContent = "Play Again";
playAgainButton.id = "play-again-btn";
playAgainButton.onclick = restartGame;
winMessage.appendChild(playAgainButton);

document.body.appendChild(winMessage);

// Card array with image values
const cards = [
    'img1', 'img1', 'img2', 'img2', 'img3', 'img3', 'img4', 'img4',
    'img5', 'img5', 'img6', 'img6', 'img7', 'img7', 'img8', 'img8',
    'img9', 'img9', 'img10', 'img10', 'img11', 'img11', 'img12', 'img12',
    'img13', 'img13', 'img14', 'img14', 'img15', 'img15', 'img16', 'img16'
];

// Shuffle cards
shuffle(cards);

// Confetti effect for winning
function triggerConfetti() {
    for (let i = 0; i < 10; i++) {
        confetti({
            particleCount: 50,
            spread: 180,
            origin: { x: Math.random(), y: 0 },
            gravity: 1,
            ticks: 500,
            scalar: 1,
            shapes: ['circle'],
            colors: ['#ff0000', '#ff9900', '#33cc33', '#0099ff', '#9900cc'],
        });
    }
}

// Initialize game board
function initBoard() {
    gameBoard.innerHTML = "";
    cards.forEach(card => {
        const cardElem = document.createElement("div");
        cardElem.classList.add("card");
        cardElem.dataset.value = card;

        const imgElem = document.createElement("img");
        imgElem.src = `img/${card}.jpg`;
        imgElem.style.display = "none";

        cardElem.appendChild(imgElem);
        cardElem.addEventListener("click", onCardClick);
        gameBoard.appendChild(cardElem);
    });

    turns = 0;
    turnsCountElem.textContent = turns;
    turnsCountElem.style.display = "block"; // Show turns label on new game
    flippedCards = [];
    matchedCards = 0;
    winMessage.style.display = "none";
    winOverlay.style.display = "none"; // Hide overlay on restart
}

// Handle card click
function onCardClick(event) {
    const clickedCard = event.currentTarget;

    if (flippedCards.length < 2 && !clickedCard.classList.contains("flipped") && !clickedCard.classList.contains("matched")) {
        clickedCard.classList.add("flipped");
        clickedCard.querySelector("img").style.display = "block";
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            turns++;
            turnsCountElem.textContent = turns;

            if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.add("matched");
                        card.style.visibility = "hidden";
                    });
                    matchedCards += 2;
                    flippedCards = [];

                    if (matchedCards === cards.length) {
                        setTimeout(() => {
                            winText.textContent = `Bạn chiến thắng với ${turns} lượt!`;
                            winOverlay.style.display = "block"; // Show overlay
                            winMessage.style.display = "block"; // Show win message
                            turnsCountElem.style.display = "none"; // Hide turns counter
                            triggerConfetti(); // Trigger confetti
                        }, 500);
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove("flipped");
                        card.querySelector("img").style.display = "none";
                    });
                    flippedCards = [];
                }, 1000);
            }
        }
    }
}

// Restart game function
function restartGame() {
    shuffle(cards);
    initBoard();
}

// Shuffle cards array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

initBoard();
