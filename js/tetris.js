"use strict";
class Tetris {

    constructor(id = 'game', speed = 80) {
      this.id = id;
      this.speed = speed;

      this.canvasSize = 2000;
      this.squareSize = 10*10;
      this.ratio = 1;

      this.gameEnd = false;
      this.gameStarted = false;
      this.gamePause = false;
      this.audio = new Audio('sounds/quack.mp3');
      this.audioBG = new Audio('sounds/tetris.mp3');
      this.audioBG.loop = true;
      this.audioPause = new Audio('sounds/pause.mp3');
      this.audioDrop = new Audio('sounds/drop.mp3');
      this.audioRotate = new Audio('sounds/rotate.mp3');
      this.audioGameOver = new Audio('sounds/gameover.mp3');
      this.audioMove = new Audio('sounds/move.mp3');
      this.audioBG.volume = 0.2;
      this.level = 1;
      this.line = 0;
      this.score = 0;

      this.pieces = [];
      this.pieces['O'] = {
        'nextX' : 1450,
        'nextY' : 230,
        'y' : 110,
        'x' : 500,
        'maxL' : 110,
        'maxR' : 800,
        'color' : 'yellow',
        'blocks' : [
          {'x' : 0, 'y' : 0},
          {'x' : 100, 'y' : 100},
          {'x' : 0, 'y' : 100},
          {'x' : 100, 'y' : 0}
        ]
      };
      this.pieces['I'] = {
        'nextX' : 1500,
        'nextY' : 130,
        'y' : 110,
        'x' : 500,
        'maxL' : 110,
        'maxR' : 900,
        'color' : 'blue',
        'blocks' : [
          {'x' : 0, 'y' : 0},
          {'x' : 0, 'y' : 100},
          {'x' : 0, 'y' : 200},
          {'x' : 0, 'y' : 300}
        ]
      };
      this.pieces['L'] = {
        'nextX' : 1450,
        'nextY' : 180,
        'y' : 110,
        'x' : 500,
        'maxL' : 110,
        'maxR' : 800,
        'color' : 'orange',
        'blocks' : [
          {'x' : 0, 'y' : 0},
          {'x' : 0, 'y' : 100},
          {'x' : 0, 'y' : 200},
          {'x' : 100, 'y' : 200}
        ]
      };
      this.pieces['J'] = {
        'nextX' : 1550,
        'nextY' : 180,
        'y' : 110,
        'x' : 600,
        'maxL' : 110,
        'maxR' : 900,
        'color' : 'pink',
        'blocks' : [
          {'x' : 0, 'y' : 0},
          {'x' : 0, 'y' : 100},
          {'x' : 0, 'y' : 200},
          {'x' : -100, 'y' : 200}
        ]
      };
      this.pieces['Z'] = {
        'nextX' : 1500,
        'nextY' : 230,
        'y' : 110,
        'x' : 500,
        'maxL' : 300,
        'maxR' : 800,
        'color' : 'green',
        'blocks' : [
          {'x' : 0, 'y' : 0},
          {'x' : -100, 'y' : 0},
          {'x' : 0, 'y' : 100},
          {'x' : 100, 'y' : 100}
        ]
      };
      this.pieces['S'] = {
        'nextX' : 1600,
        'nextY' : 230,
        'y' : 110,
        'x' : 600,
        'maxL' : 400,
        'maxR' : 900,
        'color' : 'red',
        'blocks' : [
          {'x' : 0, 'y' : 0},
          {'x' : -100, 'y' : 0},
          {'x' : -100, 'y' : 100},
          {'x' : -200, 'y' : 100}
        ]
      };
      this.pieces['T'] = {
        'nextX' : 1500,
        'nextY' : 230,
        'y' : 110,
        'x' : 500,
        'maxL' : 300,
        'maxR' : 800,
        'color' : 'purple',
        'blocks' : [
          {'x' : 0, 'y' : 0},
          {'x' : 0, 'y' : 100},
          {'x' : -100, 'y' : 0},
          {'x' : 100, 'y' : 0}
        ]
      };

      this.canvas = document.getElementById(this.id);

      if (this.canvas !== null) {
        let wrapper = document.getElementById('wrapper');
        wrapper = window.getComputedStyle(wrapper, "");
        let wrapperHeight = parseInt(wrapper.getPropertyValue('height'));
        this.ratio = wrapperHeight / this.canvasSize;
        this.canvas.height = this.canvasSize;
        this.canvas.width = this.canvasSize;
        this.canvas.style.height = this.canvasSize+'px';
        this.canvas.style.width = this.canvasSize+'px';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.ratio,this.ratio);
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.initGame();
        this.randomPiece();
        let t = this;
        setInterval(function() {
          t.movePiece();
        }, this.speed);

      } else {
        this.ctx = null;
      }
      document.addEventListener('keydown', (event) => {
        this.gameControl(event);
      });
    }

    initGame() {
        if (this.canvas !== null) {
          this.drawGame();
          this.updateGame();
          this.line = 0;
          this.score = 0;
          this.incomingPiece = null;
          this.currentPiece = null;
          this.currentPieceY = 110;
          this.currentPieceX = 0;
            this.grid = [
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
            ];
        }
    }

    gameControl(event) {
      const keyName = event.keyCode;

      if (!this.gameStarted && keyName != 13 && this.canvas !== null) return;

      switch (keyName) {
          case 13:
            if (!this.gameStarted) {
              this.audioBG.play();
              this.gameStarted = true;
              this.movePiece();
            } else if (this.gameEnd) {
              this.playAgain();
              this.gameStarted = true;
              this.gameEnd = false;
            }
            break;
          case 80:
            this.gamePause = !this.gamePause;
            if(this.gamePause) {
              this.audioBG.pause();
              this.audioPause.currentTime = 0;
              this.audioPause.play();
            } else {
              this.audioBG.play();
            }
            this.updateGame();
            break;
          case 37:
            if(this.gamePause) return;
            this.audioMove.currentTime = 0;
            this.audioMove.play();
            if(this.currentPieceX>=this.pieces[this.currentPiece].maxL)
              this.currentPieceX -= 100;
            this.lastKey = "left";
            this.movePiece();
            break;
          case 39:
            if(this.gamePause) return;
            this.audioMove.currentTime = 0;
            this.audioMove.play();
            if(this.currentPieceX<=this.pieces[this.currentPiece].maxR)
              this.currentPieceX += 100;
            this.lastKey = "right";
            this.movePiece();
            break;
          case 38:
            if(this.gamePause) return;
            this.audioRotate.currentTime = 0;
            this.audioRotate.play();
            this.lastKey = "up";
            break;
          case 40:
            if(this.gamePause) return;
            this.audio.currentTime = 0;
            this.audio.play();
            this.currentPieceY += 100;
            this.lastKey = "down";
            this.movePiece();
            break;
      }
    }

    movePiece() {

      if (this.gameEnd || !this.gameStarted || this.checkEndGame() || this.gamePause) return;

      // REDRAW GAME BLOCK
      this.ctx.clearRect(90, 100, 1010, 1800);
      this.ctx.beginPath();
      this.ctx.rect(90, 100, 1010, 1800);
      this.ctx.fillStyle = "#CCC";
      this.ctx.lineWidth=60;
      this.ctx.strokeStyle = 'green';
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.closePath();

      if(this.currentPiece == null) {
        this.currentPiece = this.incomingPiece;
        this.incomingPiece = null;
        this.drawPiece(this.pieces[this.currentPiece],0,110);
      } else {
        this.drawPiece(this.pieces[this.currentPiece],this.currentPieceX,(this.currentPieceY+100));
        this.currentPieceY += 100;
      }

      this.updateGame();
      this.randomPiece();
    }

    randomPiece() {
      if(this.incomingPiece === null) {
        // REDRAW PIECE BLOCK
        this.ctx.clearRect(1190, 100, 710, 450);
        this.ctx.beginPath();
        this.ctx.rect(1190, 100, 710, 450);
        this.ctx.fillStyle = "#CCC";
        this.ctx.lineWidth=60;
        this.ctx.strokeStyle = 'green';
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();

        let randomPiece = parseInt(this.getRandomArbitrary(0, 7)),
            pieces = ['O','I','L','J','Z','S','T'];
        this.incomingPiece = pieces[randomPiece];
      }
      this.drawPiece(this.pieces[this.incomingPiece]);
    }

    drawPiece(piece = null, x = 0, y = 0) {
      if(piece !== null) {
        if(x === 0 && y === 0) {
          x = piece.nextX;
          y = piece.nextY;
        } else if (x === 0) {
          x = piece.x;
          this.currentPieceX = x;
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth=20;
        this.ctx.fillStyle = piece.color;

        for(let i = 0; i < piece.blocks.length ; i ++) {
          this.ctx.rect(x+piece.blocks[i].x, y+piece.blocks[i].y, 90, 90);
          this.ctx.stroke();
          this.ctx.fill();
        }

        this.ctx.closePath();
      }
    }

    updateGame() {
      this.ctx.clearRect(1650, 800, 350, 800);

      this.ctx.beginPath();
      this.ctx.font = '150px Geo, serif';
      this.ctx.fillStyle = "white";
      this.ctx.fillText(("00" + this.level).slice (-3), 1725, 800);
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.font = '150px Geo, serif';
      this.ctx.fillStyle = "white";
      this.ctx.fillText(("00" + this.line).slice (-3), 1725, 1100);
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.font = '150px Geo, serif';
      this.ctx.fillStyle = "white";
      this.ctx.fillText(("000" + this.line).slice (-4), 1650, 1400);
      this.ctx.closePath();

      this.ctx.clearRect(1170, 1600, 830, 200);

      this.ctx.beginPath();
      this.ctx.font = '100px Geo, serif';
      this.ctx.fillStyle = "white";
      if (this.gameStarted) {
        if(!this.gamePause) {
          this.ctx.fillText('press p to pause', 1170, 1700);
        } else {
          this.ctx.fillText('press p to resume', 1170, 1700);
        }
      } else {
        this.ctx.fillText('press enter to play', 1170, 1700);
      }
      this.ctx.closePath();
    }

    drawGame() {
      // GAME BLOCK
      this.ctx.beginPath();
      this.ctx.rect(90, 100, 1010, 1800);
      this.ctx.fillStyle = "#CCC";
      this.ctx.lineWidth=60;
      this.ctx.strokeStyle = 'green';
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.closePath();

      // NEXT PIECE BLOCK
      this.ctx.beginPath();
      this.ctx.rect(1190, 100, 710, 450);
      this.ctx.fillStyle = "#CCC";
      this.ctx.lineWidth=60;
      this.ctx.strokeStyle = 'green';
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.font = '150px Geo, serif';
      this.ctx.fillStyle = "white";
      this.ctx.fillText('level', 1170, 800);
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.font = '150px Geo, serif';
      this.ctx.fillStyle = "white";
      this.ctx.fillText('line', 1170, 1100);
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.font = '150px Geo, serif';
      this.ctx.fillStyle = "white";
      this.ctx.fillText('score', 1170, 1400);
      this.ctx.closePath();
    }

    getRandomArbitrary(min, max) {
      return  min + Math.floor(Math.random() * max);
    }

    checkEndGame() {
      return this.gameEnd;
    }

    playAgain() {
      this.initGame();
    }
}
(function() {
    new Tetris('game', 750);
})();
