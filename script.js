const GRID = document.querySelector(".grid-container");
const SCORE = document.querySelectorAll("h3");
const BUTTONS = document.querySelectorAll("button");
const INPUT = document.querySelector("input");

var squares = [];
var rowsandcolums;
var headPos;
var pointPos = [0, 0];

var points = 0;

var dir = "";
var interval;
var gameOn = false;
var gameReady = false;
var addBody = false;

function changeDirection(e){
  if (gameReady){
    if (e.key == "w" || e.code == "ArrowUp"){
      if (dir == "down"){
        loseGame();
      }

      dir = "up";
    }
    else if (e.key == "a" || e.code === "ArrowLeft"){
      if (dir == "right"){
        loseGame();
      }

      dir = "left";
    }
    else if (e.key == "d" || e.code == "ArrowRight"){
      if (dir == "left"){
        loseGame();
      }

      dir = "right";
    }
    else if (e.key == "s" || e.code == "ArrowDown"){
      if (dir == "up"){
        loseGame();
      }

      dir = "down";
    }
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
  squares[lastPoint[0]*rowsandcolums + lastPoint[1]].classList.remove("box-selected");
  }
  squares[headPos[0][0]*rowsandcolums + headPos[0][1]].classList.add("box-selected");
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
  squares[randomPoint[0]*rowsandcolums + randomPoint[1]].classList.add("box-selected");
}

function loseGame(){
  clearInterval(interval);
  GRID.classList.add("lost");
  console.log("lost");
}

function start(e){
  if (!gameOn && gameReady){
    if (e.key == "w" || e.code == "ArrowUp" || e.key == "a" || e.code === "ArrowLeft"
        || e.key == "d" || e.code == "ArrowRight" || e.key == "s" || e.code == "ArrowDown"){
          interval = setInterval(moveSnake, 200);
          randomPoint(headPos[0]);
          gameOn = true;
    }
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

  for (let i = 0; i < squares.length; i++){
    squares[i].classList.remove("box-selected");
  }

  squares[headPos[0][0]*rowsandcolums + headPos[0][1]].classList.add("box-selected");
  GRID.classList.remove("lost");
}

function clearGrid(){
  if (squares.length > 1){
    for (let i = 0; i < squares.length; i++){
      GRID.removeChild(squares[i]);
    }
  }
}

function spawnGrid(){
  clearGrid();

  var gridSize = "";
  for (let i = 0; i < INPUT.value; i++){
      for (let j = 0; j < INPUT.value; j++){
        let box = document.createElement("div");
        box.classList.add("grid-item");
        GRID.appendChild(box);
      }
    gridSize += " 30px";
    console.log("test");
  }
  console.log(gridSize);

  GRID.style.cssText = "grid-template-columns:" + gridSize + "; grid-template-rows:" + gridSize + ";";

  squares = document.querySelectorAll(".grid-item");
  rowsandcolums = INPUT.value;
  console.log(rowsandcolums);
  headPos = [[Math.floor(rowsandcolums/2), Math.floor(rowsandcolums/2)]];
  console.log(headPos);
  squares[headPos[0][0]*rowsandcolums + headPos[0][1]].classList.add("box-selected");
  gameReady = true;
}

document.addEventListener("keyup", start, false);
document.addEventListener("keydown", changeDirection, false);
BUTTONS[0].addEventListener('click', reset, false);
BUTTONS[1].addEventListener('click', spawnGrid, false);
