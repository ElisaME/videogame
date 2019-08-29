const cover = document.querySelector('.cover')
const start = document.getElementById('start')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let interval
let frames = 0
let obstacles = []
let computers = []
let enemies = []
let points = 100
let types = ['amazon','antojo','chela','computadora']
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
        this.width = 50
        this.height = 50
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
        this.active = true
        this.x = x
        this.y = y
        this.width = 30
        this.height = 30
        this.type = type
        this.img = new Image()
        this.img.src = this.getImage(this.type)
    }
    getImage(type){
        switch (type) {
            case 'amazon':
                this.width += 20
                return './assets/amazon.png'
                break;
            case 'antojo':
                return './assets/dona.png'
                break; 
            case 'chela':
                return './assets/beer.png'
                break;
            case 'computadora':
                return './assets/computer.png'
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

//CheckCollition with Obstacles
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

//Enemies 
function createEnemies(){
    if(frames % 150 === 0){
        let minY = 330
        let maxY = 600
        let x= canvas.width
        let y = Math.floor(Math.random() * (maxY-minY + 1) + minY)
        let type = types[Math.floor(Math.random() * types.length)]
        enemies.push(new Enemie(x,y,type))
    }
}

function drawEnemies(){
    enemies.forEach(e =>{
        if (e.active){
        e.x -= 1
        e.draw()}
    })
}

function crashObject(){
    enemies.forEach(element => {
        if(girl.crashing(element)){
            let index = enemies.indexOf(element);
            enemies.splice(index, 1);
            element.active = false
            if(element.type == 'computadora'){
                points += 100
            }else{
                points -= 30
            }
        } 
    })
}

//Score
function drawScore(){
    let moneyDraw = new Image()
    moneyDraw.src = './assets/money.png'
    ctx.drawImage(moneyDraw,0,0,80,40)
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(70,10,points,25);
    ctx.font = '20px Courier'
    ctx.fillStyle='#000000'
    ctx.fillText(`$${points}`, 70, 30)
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
    createEnemies()
    drawEnemies()
    checkCollition()
    crashObject()
    drawScore()
}

//Iniciar Juego
function loadGame() {
    interval = setInterval(updateCanvas, 1000/60)
}

//Listeners
document.onkeydown= (e) =>{
    e.preventDefault()
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
start.addEventListener('click',() =>{
    cover.style.display='none'
    start.style.display='none'
    canvas.style.display='block'
    loadGame()
})
//loadGame()