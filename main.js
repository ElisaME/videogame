const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let interval

//Clases
class Board{
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.img = new Image()
        this.img.src = './assets/fondo4.gif'
        this.onload = () => {
            this.draw()
        }
    }
    drawImage(){
         //Board with infinite loop
        this.x--
        if (this.x < -500) {
        this.x = 0
        }
        ctx.drawImage(this.img, this.x, this.y, 500, canvas.height-180)
        ctx.drawImage(this.img, this.x + 500, this.y, 500, canvas.height-180)
    }
    drawRoad(){
        ctx.fillStyle='gray'
        ctx.fillRect(0,320,canvas.width,180)
    }
}

const board = new Board()
function updateCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    board.drawImage()
    board.drawRoad()
}

//Iniciar Juego
function startGame() {
    interval = setInterval(updateCanvas, 1000/60)
  }

startGame()