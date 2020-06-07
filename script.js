const GRID = document.querySelector(".grid-container");
const SQUARES = document.querySelectorAll(".grid-item");
const SCORE = document.querySelectorAll("h3");
const RESET = document.querySelector("button");

var rowsandcolums = Math.sqrt(SQUARES.length);
var headPos = [[Math.floor(rowsandcolums/2), Math.floor(rowsandcolums/2)]];
var pointPos = [0, 0];

var points = 0;

var dir = "";
var interval;
var gameOn = false;
var addBody = false;

SQUARES[headPos[0][0]*rowsandcolums + headPos[0][1]].classList.add("box-selected");

function changeDirection(e){
  if (e.key == "w" || e.code == 38){
    if (dir == "down"){
      loseGame();
    }

    dir = "up";
  }
  else if (e.key == "a" || e.code === 37){
    if (dir == "right"){
      loseGame();
    }

    dir = "left";
  }
  else if (e.key == "d" || e.code == 39){
    if (dir == "left"){
      loseGame();
    }

    dir = "right";
  }
  else if (e.key == "s" || e.code == 40){
    if (dir == "up"){
      loseGame();
    }

    dir = "down";
  }
}

function moveArray(){
  for (let i = headPos.length-1; i > 0; i--){
    headPos[i][0] = headPos[i-1][0];
    headPos[i][1] = headPos[i-1][1];
  }

  return [headPos[headPos.length-1][0], headPos[headPos.length-1][1]];
}

function checkCollision(){
  if (headPos[0][0] >= rowsandcolums || headPos[0][0] < 0 || headPos[0][1] >= rowsandcolums || headPos[0][1] < 0){
    return true;
  }

  for (let i = 1; i < headPos.length; i++){
    if (headPos[0][0] == headPos[i][0] && headPos[0][1] == headPos[i][1]){
      return true;
    }
  }
}

function addScore(score){
      SCORE[1].innerHTML = score;
}

function moveSnake(){

  var pointRemove = [headPos[headPos.length-1][0], headPos[headPos.length-1][1]];
  let lastPoint = moveArray();
  if (dir === "up"){
      headPos[0][0]--;
  }
  else if (dir === "left"){
      headPos[0][1]--;
  }
  else if (dir === "right"){
      headPos[0][1]++;
  }
  else if (dir === "down"){
      headPos[0][0]++;
  }

  if (headPos[0][0] == pointPos[0] && headPos[0][1] == pointPos[1]){
    points++;
    addScore(points);
    addBody = true;
    randomPoint(pointRemove);
    headPos.push([pointRemove[0], pointRemove[1]]);
  }

  if (checkCollision()){
    loseGame();
  }
  else {
    changeGrid(pointRemove, addBody);
  }

  if (addBody){
    addBody = false;
  }
}

function changeGrid(lastPoint, addBody){
  if (!addBody){
  SQUARES[lastPoint[0]*rowsandcolums + lastPoint[1]].classList.remove("box-selected");
  }
  SQUARES[headPos[0][0]*rowsandcolums + headPos[0][1]].classList.add("box-selected");
}

function randomPoint(removedPoint){
  let randomPoint = [0, 0];
  var pointTaken = true;

  while(pointTaken){
    randomPoint[0] = Math.floor(Math.random() * (rowsandcolums));
    randomPoint[1] = Math.floor(Math.random() * (rowsandcolums));
    pointTaken = false;

    if (randomPoint[0] == removedPoint[0] && randomPoint[1] == removedPoint[1]){
      pointTaken = true;
    }

    for (let i = 0; i < headPos.length; i++){
      if (randomPoint[0] == headPos[i][0] && randomPoint[1] == headPos[i][1]){
        pointTaken = true;
      }
    }
  }

  pointPos = randomPoint;
  SQUARES[randomPoint[0]*rowsandcolums + randomPoint[1]].classList.add("box-selected");
}

function loseGame(){
  clearInterval(interval);
  GRID.classList.add("lost");
  console.log("lost");
}

function start(){
  if (!gameOn){
    interval = setInterval(moveSnake, 200);
    randomPoint(headPos[0]);
    gameOn = true;
  }
}

function reset(){
  clearInterval(interval);
  headPos = [[Math.floor(rowsandcolums/2), Math.floor(rowsandcolums/2)]];
  pointPos = [0, 0];
  points = 0;
  addScore(0);
  dir = "";
  interval = null;
  gameOn = false;
  addBody = false;

  for (let i = 0; i < SQUARES.length; i++){
    SQUARES[i].classList.remove("box-selected");
  }

  SQUARES[headPos[0][0]*rowsandcolums + headPos[0][1]].classList.add("box-selected");
  GRID.classList.remove("lost");
}

document.addEventListener("keyup", start, false);
document.addEventListener("keydown", changeDirection, false);
RESET.addEventListener('click', reset, false);
