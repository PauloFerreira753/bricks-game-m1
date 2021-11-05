// * MY CANVAS SETUP
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 600;

const scoreDisplay = document.querySelector(".high-score");
const reset = document.querySelector(".reset");
let highestScore = parseInt(localStorage.getItem("highestScore"));

//*GLOBAL VARIABLES
let score = 0;
let speed = 8;
let gameLevelUp = true;

 
let brickRowCount = 4;
let brickColumnCount = 5;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 20;
let brickOffsetTop = 30;
let brickOffsetLeft = 35;

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}


if (isNaN(highestScore)) {
  highestScore = 0;
}

scoreDisplay.innerHTML = `Highest Score : ${highestScore}`;

reset.addEventListener("click", () => {
  localStorage.setItem("highestScore", "0");
  score = 0;
  scoreDisplay.innerHTML = `Highest Score: 0`;
  drawBricks();
});

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}


function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText( "Score: " + score, 8, 20);
}




// Creating the ball
let ball = {
  x: canvas.height / 2,
  y: canvas.height - 50,
  dx: speed,
  dy: -speed + 1,
  radius: 7,
  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
};


//Creating the paddle
let paddle = {
  height: 12,
  width: 86,
  x: canvas.width / 2 - 76 / 2,
  draw: function() {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
  }
};


//* FUNCTIONS

//Creating the main function play
function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  ball.draw();
  paddle.draw();
  movePaddle();
  collisionDetection();
  levelUp();
  drawScore();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }


// Reseting the score
  if (ball.y + ball.radius > canvas.height) {
    if (score > parseInt(localStorage.getItem("highestScore"))) {
      localStorage.setItem("highestScore", score.toString());
      scoreDisplay.innerHTML = `Highest Score: ${score}`;
    }
    score = 0;
    generateBricks();
    ball.dx = speed;
    ball.dy = -speed + 1;
  }


  // Rebound
    if (
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width &&
      ball.y + ball.radius >= canvas.height - paddle.height
    ) {
      ball.dy *= -1;
    }
  
    requestAnimationFrame(play);
  }




// Creating the movement of the paddle for 7 pixel
function movePaddle() {
  if (rightPressed) {
    paddle.x += 7;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  } else if (leftPressed) {
    paddle.x -= 7;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}


let bricks = [];

function generateBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}


// Creating a for loop to interate the r an c arrays
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


// Checking the ball axis with the brickWidth and brickHeight
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          ball.x >= b.x &&
          ball.x <= b.x + brickWidth &&
          ball.y >= b.y &&
          ball.y <= b.y + brickHeight
        ) {
          ball.dy *= -1;
          b.status = 0;
          score++;
        }
      }
    }
  }
}



// Creating a condition to let the score 0 to add new 15 elements
function levelUp() {
  if (score % 20 == 0 && score != 0) {
    if (ball.y > canvas.height / 2) {
      generateBricks();
    }

    if (gameLevelUp) {
      if (ball.dy > 0) {
        ball.dy += 1;
        gameLevelUp = false;
      } else {
        ball.dy -= 1;
        gameLevelUp = false;
      }
      console.log(ball.dy);
    }
  }

  if (score % 20 != 0) {
    gameLevelUp = true;
  }
}

generateBricks();
play();