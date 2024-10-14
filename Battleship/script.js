document.getElementById('singlePlayerBtn').addEventListener('click', startSinglePlayer);
document.getElementById('twoPlayerBtn').addEventListener('click', startTwoPlayer);

function startSinglePlayer() {
  document.getElementById('game-container').classList.remove('hidden');
  setupBoards();
  // Thêm logic AI cho 1 người chơi ở đây
}

function startTwoPlayer() {
  document.getElementById('game-container').classList.remove('hidden');
  setupBoards();
  // Thêm logic cho 2 người chơi ở đây
}

function setupBoards() {
  const player1Board = document.getElementById('player1-board');
  const player2Board = document.getElementById('player2-board');

  for (let i = 0; i < 100; i++) {
    const p1Cell = document.createElement('div');
    const p2Cell = document.createElement('div');
    player1Board.appendChild(p1Cell);
    player2Board.appendChild(p2Cell);

    // Gán sự kiện cho các ô để xử lý click
    p1Cell.addEventListener('click', () => handlePlayerClick(p1Cell, 'Player 1'));
    p2Cell.addEventListener('click', () => handlePlayerClick(p2Cell, 'Player 2'));
  }
}

function handlePlayerClick(cell, player) {
  if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
    const isHit = Math.random() > 0.5; // Giả lập ngẫu nhiên hit hoặc miss
    if (isHit) {
      cell.classList.add('hit');
      alert(player + ' hits!');
    } else {
      cell.classList.add('miss');
      alert(player + ' misses!');
    }
  }
}
