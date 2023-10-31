let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let interval = setInterval(draw, 10);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

canvas.height = 650
canvas.width = 1000

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let paddleHeight = 13;
let paddleWidth = 60;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let rightPressed = false;
let leftPressed = false;

let brickRowCount = getRandomInt(5, 8);
let brickColumnCount = getRandomInt(4, 6);
let brickWidth = 75;
let brickHeight = 25;
let brickPadding = 40;
let brickOffsetTop = 70;
let brickOffsetLeft = 120;

let score = 0;
let lives = 3;


function drawBall() { //BALL
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#ec5f08"
    ctx.fill()
    ctx.strokeStyle = "black"
    ctx.stroke()
    ctx.closePath()
}

function drawPaddle() { //PADDLE
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD"
    ctx.fill()
    ctx.strokeStyle = "black"
    ctx.stroke()
    ctx.closePath()
}

let brickColors = [];

for (let i = 0; i < brickRowCount * brickColumnCount; i++) {
    brickColors.push(getRandomColor());
}

function drawBricks() { //BRICKS
    let colorIndex = 0
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop

                const color = brickColors[colorIndex]

                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = color
                ctx.fill()
                ctx.strokeStyle = "black"
                ctx.stroke()
                ctx.closePath()
                colorIndex++
            }
        }
    }
}


let bricks = []
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }

    }
}


function collisionDetection() { //BRICKS COLLISION
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r]
            if (b.status === 1) {
                if (x > b.x - 12 &&
                    x < b.x + (brickWidth + 10 ) &&
                    y > b.y + (brickHeight - 35) &&
                    y < b.y + brickHeight + ballRadius) {
                    dy = -dy;
                    b.status = 0
                    score++
                    if (score === brickRowCount * brickColumnCount) {
                        alert("It's Won!!")
                        document.location.reload()
                        clearInterval(interval)
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall()
    drawPaddle()
    drawBricks()
    collisionDetection();
    drawScore()
    drawLives()
    x += dx;
    y += dy;
    //BALL
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) { //LEFT RIGHT REBOUND
        dx = -dx
    }
    if (y + dy < ballRadius) { //TOP REBOUND
        dy = -dy
    }
    else if (y + dy > canvas.height - ballRadius - 10) {
        if (x > paddleX && x < paddleX + paddleWidth) { //PADDLE REBOUND
            dy = -dy
        }
        else {
            lives--
            if (!lives) {
                alert("GAME OVER")
                document.location.reload()
                clearInterval(interval)
            } else {
                x = canvas.width / 2
                y = canvas.height - 30
                dx = 2
                dy = -2
                paddleX = (canvas.width - paddleWidth) / 2
            }
        }
    }
    //PADDLE MOVE
    if (rightPressed) {
        paddleX += 7
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth
        }
    } else if (leftPressed) {
        paddleX -= 7
        if (paddleX < 0) {
            paddleX = 0
        }
    }
} 


//KEY CONFIG
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

