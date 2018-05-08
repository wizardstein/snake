let _game;
var gameLoopHandle;
var pollingHandle;
let Snake = function(forGame,startingDirection, startingBody){
  this.going = startingDirection || "RIGHT";

  this.go = function(direction){
    let snakeHead = {x:this.getHead().x,y:this.getHead().y};
    

    switch(direction.toLowerCase()){
      case "left":
        snakeHead.y--;
        this.going = "LEFT";
        break;
      case "right":
        snakeHead.y++;
        this.going = "RIGHT";
        break;
      case "up":
        snakeHead.x--;
        this.going = "UP";
        break;
      case "down":
        snakeHead.x++;
        this.going = "DOWN";
        break;
    }
    let newBlock = 
    generateBlock(snakeHead.x,snakeHead.y,
      this.gameInstance.boardSizeX,this.gameInstance.boardSizeY);

    

    if (this.posIsTail(newBlock)){
      
      this.gameInstance.ended = true;
    }
    this.addBlockHeadToSnake(newBlock);

    if (this.posIsApple(newBlock)) {
      this.gameInstance.score++;
      this.gameInstance.genApple = true;
    } else {
      this.removeBockTailFromSnake();
    }
  };

  this.body = startingBody || [
    {x:9,y:8},
    {x:9,y:9},
    {x:9,y:10},
    {x:9,y:11},
  ];

  this.gameInstance = forGame;
  this.getHead = function(){
    return this.body[this.body.length-1];
  };

  this.posIsTail = function(pos){
    for (let i = 0; i<this.body.length;i++){
      if (pos.x === this.body[i].x && pos.y === this.body[i].y) {
        return true;
      }
    }
    return false;
  };

  this.posIsApple = function(pos){
    return pos.x === this.gameInstance.apple.x && pos.y === this.gameInstance.apple.y;
  };

  this.addBlockHeadToSnake = function(block){
    this.body.push(block);
  }

  this.removeBockTailFromSnake = function(){
    this.body.shift();
  }
}
let serverListener = function(keyEvents){
  console.log(keyEvents);
  for (let i = 0; i<keyEvents.length;i++) {
    var event = new Event('keydown');
    event.key="Arrow" + capitalizeFirstLetter(keyEvents[i].toLowerCase());
    document.dispatchEvent(event);
  }
}




let SnakeGame = function(){
  this.board = [];
  this.snake = {};
  this.apple = {};
  this.score = 0;
  this.speed = 500;
  this.ended = false;
  this.genApple = true;
  this.boardSizeX = 20;
  this.boardSizeY = 20;
  this.manager = {};
}

SnakeGame.prototype.init = function(options){
  options = options || {};
  this.boardSizeX = options.boardSizeX || 20;
  this.boardSizeY = options.boardSizeY || 20;
  
  this.snake = options.snake || new Snake(this);
  
}

SnakeGame.prototype.setSnake = function(){
  // sets snake to provided params
}

SnakeGame.prototype.generateBoard = function(){
  this.board = [];
  for (let i=0;i<this.boardSizeX;i++){
    let boardRow=[];
    for (let j = 0; j < this.boardSizeY; j++) {
      let havePixel = false;
      for (let k = 0; k<this.snake.body.length;k++){
        if (this.snake.body[k].x === i && this.snake.body[k].y === j ){
          havePixel = true;
        }
      }
      if (havePixel) {
        boardRow.push(1);
      } else {
        boardRow.push(0);
      }
    }
    this.board.push(boardRow);
  }
}

SnakeGame.prototype.setSpeed = function(speed){
  this.speed = speed;
}

SnakeGame.prototype.setScore = function(score){
  this.score = score;
}

let generateBlock = function(x,y,limitX,limitY){
  let block = {};
  if (x===limitX) {
    block.x = 0;
  } else if (x == -1) {
    block.x = limitX-1;
  } else {
    block.x = x;
  }

  if (y===limitY) {
    block.y = 0;
  } else if (y == -1) {
    block.y = limitY-1;
  } else {
    block.y = y;
  }

  return block;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let genericDiv = function(color){
  let returnDiv = document.createElement("div");
  returnDiv.style.height = "10px";
  returnDiv.style.width = "10px";
  returnDiv.style.background = color;

  return returnDiv;
}

let snakeDiv = function(){
return genericDiv("lime");
}

let emptyDiv = function(){
return genericDiv("black");
}

let appleDiv = function(){
return genericDiv("red");
}

function updateDOM(game) {
  var el = document.getElementById("gameboard");
  el.innerHTML = "";
  el.style.position = "relative";
  var scoreEl = document.getElementById("score");
  scoreEl.innerText = game.score;
  if (game.genApple) {
    game.apple.x = getRandomInt(0,game.board.length-1);
    game.apple.y = getRandomInt(0,game.board.length-1);
    game.genApple = false;
  }

  for (let i =0;i<game.board.length;i++){
    let snakeRowDiv = document.createElement("div");
    //snakeRowDiv.style.position = "absolute";
    for (let j=0;j<game.board[i].length;j++){
      let whichDiv = null;
      if (game.board[i][j]){
        whichDiv = snakeDiv();
      } else if (i==game.apple.x && j == game.apple.y){
          whichDiv = appleDiv();
      } 
      
      if (whichDiv == null){
        whichDiv = emptyDiv();
      }
       
      whichDiv.style.position = "absolute";
      whichDiv.style.left = j * (parseInt(whichDiv.style.width)) + "px";
      whichDiv.style.top = (i * (parseInt(whichDiv.style.height)) + 100)  + "px";
      snakeRowDiv.appendChild(whichDiv);
    
    }

    el.appendChild(snakeRowDiv);
  }
}

function generateDomListener(game){
  return function(event){
    switch (event.key) {
      case "ArrowUp":
        if (game.snake.going != "DOWN"){
          game.snake.going = "UP";
        }
        break;
      case "ArrowDown":
        if (game.snake.going != "UP"){
          game.snake.going = "DOWN";
        }
        break;
      case "ArrowLeft":
        if (game.snake.going != "RIGHT") {
          game.snake.going = "LEFT";
        }
        
        break;
      case "ArrowRight":
        if (game.snake.going != "LEFT") {
          game.snake.going = "RIGHT";
        }
        break;
    }
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function decreaseDifficulty(game){
  if (game.speed <= 900) {
    game.speed += 50;
  }
  clearInterval(gameLoopHandle);
  gameLoopHandle = setInterval(gameLoop(game), game.speed);
}
function restart(game){
  game.ended = false;
  game.genApple = true;
  game.score = 0;
  game.speed = 500;
  game.apple = {x:null,y:null}

  game.snake.body = [
    {x:9,y:8},
    {x:9,y:9},
    {x:9,y:10},
    {x:9,y:11},
  ]
  game.snake.going = "RIGHT";

  clearInterval(gameLoopHandle);
  gameLoopHandle = setInterval(gameLoop(game), game.speed);
  
}
function increaseDifficulty(game){
  if (game.speed >= 100) {
    game.speed -= 50;
  }
  clearInterval(gameLoopHandle);
  gameLoopHandle = setInterval(gameLoop(game), game.speed);
}

function gameLoop(game){
  return function(){
    if (!game.ended) {
      game.snake.go(game.snake.going);
      game.generateBoard();
      updateDOM(game);
    } else {
      clearInterval(gameLoopHandle);
      alert ("GAME OVER");
    }
  }
}
function polling(game){
  return function(){
  var scriptsDiv = document.getElementById("scripts");
  var script = document.createElement('script');
    script.src="http://172.168.1.22/snake_relay/?command=get&callbackname=serverListener";
    if (game.scripts) {
      if (game.scripts.length == 100){
        let msg = "too many scripts, clearing the div";

        scriptsDiv.innerHTML = ""
      }
      game.scripts.push(script);
    } else {
      game.scripts = [script];
    }
    scriptsDiv.appendChild(script);
  }
}
document.addEventListener("DOMContentLoaded", function(event) {
  var game = new SnakeGame();
  _game =game;
  game.init();
  game.generateBoard()
  updateDOM(game);
  document.addEventListener("keydown", generateDomListener(game));
  //pollingHandle = setInterval(polling(game), 100);

  gameLoopHandle = setInterval(gameLoop(game), game.speed);
})