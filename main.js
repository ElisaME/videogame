const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let interval
let frames = 0
let obstacles = []
let computers = []
let points = 0
//Clases
class Board{
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.img = new Image()
        this.img.src = './assets/fondo3.gif'
        this.onload = () => {
            this.draw()
        }
        this.buttonImg = new Image()
        this.buttonImg.src = './assets/start_button.png'
    }
    drawImage(){
         //Board with infinite loop
        this.x--
        if (this.x < -canvas.width) {
        this.x = 0
        }
        ctx.drawImage(this.img, this.x, this.y, canvas.width, canvas.height)
        ctx.drawImage(this.img, this.x + canvas.width, this.y, canvas.width, canvas.height)
    }
    drawRoad(){
        ctx.fillStyle='gray'
        ctx.fillRect(0,320,canvas.width,280)

        ctx.lineWidth = 4
        ctx.strokeStyle='white'
        ctx.beginPath()
        ctx.moveTo(0,330)
        ctx.lineTo(canvas.width, 330)
        ctx.stroke()
        ctx.closePath()
        ctx.beginPath()
        ctx.moveTo(0,590)
        ctx.lineTo(canvas.width, 590)
        ctx.stroke()
        ctx.closePath()
    }
    drawButton(){
        ctx.drawImage(this.buttonImg ,320,270,270,90)
    }
    drawText(){
        ctx.fillStyle='white'
        ctx.font = "30px Arial";
        ctx.fillText("PRESS SPACE BAR TO START", 270, 400);
    }
}

class Girl{
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 40
        this.height = 40
        this.img = new Image()
        this.img.src = './assets/girl_1.png'
    }
    draw(){
        // ctx.fillStyle = 'white'
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img,this.x,this.y, this.width, this.height)
        //ctx.drawImage(this.img, 0, 0, 85, 85, this.x, this.y, 85, 85)
    }
    top(){
        return this.y
    }
    bottom(){
        return this.y + this.height
    }
    left(){
        return this.x
    }
    right(){
        return this.x + this.width
    }
    moveRight(){ 
        if (this.right() < canvas.width - 50)   
        this.x += 10
    }
    moveLeft(){
        if (this.left() > this.width)
        this.x -= 10
    }
    moveUp(){
        if (this.top() > 320-this.height/2)
        this.y -= 10
    }
    moveDown(){
        if (this.bottom() < canvas.height)
        this.y += 10
    }
    crashing(object) {
        return (
            this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.y + this.height > object.y)
    }
}

class Computer{
    constructor(x,y){
        this.active = true
        this.x = x
        this.y = y
        this.width = 40
        this.height = 40
        this.img = new Image()
        this.img.src = './assets/computer.png'
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    top(){
        return this.y
    }
    bottom(){
        return this.y + this.height
    }
    left(){
        return this.x
    }
    right(){
        return this.x + this.width
    }
}

class Obstacle{
    constructor(x,y,width,height){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = randomColor()
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    top(){
        return this.y
    }
    bottom(){
        return this.y + this.height
    }
    left(){
        return this.x
    }
    right(){
        return this.x + this.width
    }
}

class Enemie{
    constructor(x, y, type){
        this.x = x
        this.y = y
        this.width = 20
        this.height = 20
        this.img = new Image()
        this.img.src = this.getImage()
        this.type = type
    }
    getImage(){
        switch (type) {
            case amazon:
                return './assets/amazon.png'
                break;
            case antojo:
                return './assets/dona.png'
                break; 
            case chela:
                return './assets/beer.png'
                break;
            default:
                break;
        }
    }
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}
//Instancias
const board = new Board()
const girl = new Girl(10, 420)

//Helper Functions
function createObstacles(){
    if (frames % 250 === 0) {
        let x = canvas.width
        let minHeight = 90
        let maxHeight = 170
        let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight)
        let minGap = 50
        let maxGap = 100
        let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)
        obstacles.push(new Obstacle (x, 320, 10, height))
        obstacles.push(new Obstacle (x, 330 + height + gap, 10 , x-330-height-gap))
    }
}

//Draw Obstacles
function drawObstacles (){
    obstacles.forEach(obstacle =>{
        obstacle.x -= 1
        obstacle.draw()
    })
}

//Random Color of obstacles
function randomColor(){
    h = 340;
    s = Math.floor(Math.random() * 100);
    l = Math.floor(Math.random() * 100);
    color = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    return color
}

//CheckCollition
function checkCollition() {
    if (girl.y > canvas.height - girl.height) return gameOver()
    obstacles.forEach(obstacle => {
        if (girl.crashing(obstacle)) return gameOver()
    })
}

  //GameOver
function gameOver() {
    ctx.font = '50px Impact'
    ctx.fillStyle='#000000'
    ctx.fillText('Game Over', canvas.width / 2 - 110, 200)
    clearInterval(interval)
}

//Computers
function createComputers(){
    if (frames % 150 === 0) {
        let minX = 0
        let maxX = 900
        let minY = 330
        let maxY = 600
        let x = Math.floor(Math.random() * (maxX-minX + 1) + minX)
        let y = Math.floor(Math.random() * (maxY-minY + 1) + minY)
        computers.push(new Computer(x,y))
        // console.log(x)        
        // console.log(y)
    }
}
function drawComputers(){
    computers.forEach(computer =>{
        if (computer.active){
        computer.draw()}
    })
}
function pickComputer(){
    computers.forEach(object => {
        if(girl.crashing(object)){
            let index = computers.indexOf(object);
            computers.splice(index, 1);
            object.active = false
            points ++
        } 
    })
}

//Score
function drawScore(){
    ctx.font = '20px Impact'
    ctx.fillStyle='#000000'
    ctx.fillText(`Dinero: $${points}`, 50, 50)
}
//Update Canvas
function updateCanvas(){
    frames += 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    board.drawImage()
    board.drawRoad() 
    // board.drawButton()
    // board.drawText()
    girl.draw()
    createObstacles()
    drawObstacles()
    createComputers()
    drawComputers()
    checkCollition()
    pickComputer()
    drawScore()
}

//Iniciar Juego
function loadGame() {
    interval = setInterval(updateCanvas, 1000/60)
}
//aun no se usa esta
function start(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    board.drawImage()
    board.drawRoad()
    girl.draw()
}

//Listeners
document.onkeydown= (e) =>{
    switch (e.keyCode) {
        case 32:
            start()
            break;
        case 39:
            girl.moveRight()
            break;
        case 38:
            girl.moveUp()
            break;
        case 40:
            girl.moveDown()
            break;
        case 37:
            girl.moveLeft()
            break;
        default:
            break;
    }
}

loadGame()