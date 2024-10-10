document.addEventListener("DOMContentLoaded", function () {
    const dinosaur = document.getElementById('dinosaur');
    const startGameCheckbox = document.getElementById('start-game');
    let isJumping = false;
    let isGameOver = false;
  
    // Function to make the dinosaur jump
    function jump() {
      if (isJumping) return;
      isJumping = true;
      let jumpHeight = 0;
      let upInterval = setInterval(() => {
        if (jumpHeight >= 150) {
          clearInterval(upInterval);
          let downInterval = setInterval(() => {
            if (jumpHeight <= 0) {
              clearInterval(downInterval);
              isJumping = false;
            } else {
              jumpHeight -= 5;
              dinosaur.style.bottom = jumpHeight + 'px';
            }
          }, 20);
        } else {
          jumpHeight += 5;
          dinosaur.style.bottom = jumpHeight + 'px';
        }
      }, 20);
    }
  
    // Detect key press for jump
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
      }
    });
  
    // Start game event
    startGameCheckbox.addEventListener('change', function () {
      if (startGameCheckbox.checked) {
        isGameOver = false;
        document.getElementById('gameover').style.display = 'none';
        startCactusMovement();
      } else {
        isGameOver = true;
        document.getElementById('gameover').style.display = 'block';
        resetCactus();
      }
    });
  
    function startCactusMovement() {
      // Move cactus and check for collisions
      const cactuses = document.querySelectorAll('label[for^="cactus-"]');
      cactuses.forEach((cactus) => {
        cactus.style.animationPlayState = 'running';
      });
  
      setInterval(() => {
        if (isGameOver) return;
  
        const cactus1 = document.querySelector('label[for="cactus-1"]');
        const cactusPosition = cactus1.getBoundingClientRect();
        const dinoPosition = dinosaur.getBoundingClientRect();
  
        if (
          cactusPosition.left < dinoPosition.right &&
          cactusPosition.right > dinoPosition.left &&
          cactusPosition.bottom > dinoPosition.top
        ) {
          // Collision detected
          isGameOver = true;
          document.getElementById('gameover').style.display = 'block';
          resetCactus();
        }
      }, 20);
    }
  
    function resetCactus() {
      const cactuses = document.querySelectorAll('label[for^="cactus-"]');
      cactuses.forEach((cactus) => {
        cactus.style.animationPlayState = 'paused';
      });
    }
  });
  