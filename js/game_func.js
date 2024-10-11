const padding = 80
const safeBuffer = 20
const canvas = document.getElementById('gameCanvas')
const startBtn = document.getElementById('startBtn')
const ctx = canvas.getContext('2d')
const img_a = new Image()//apple
const img_h = new Image()//hero
const img_c = new Image()//cactus

const DEFAULT_COLOR1 = '#aaaaaa' //harmaa
const DEFAULT_COLOR2 = '#888888'
let headColor = DEFAULT_COLOR1
let baseColor = DEFAULT_COLOR2

const chanceSpawnNextToExisting = 0.4

let imagesLoaded = 0

const apples = []
const cacti = []
const enemies = []
let player = { x: 50, y: 50, size: 20, speed: 3 }
let target = { x: player.x, y: player.y }
let moving = false
let harvestedCount = 0
let applesReadyForHarvesting = true
let playingEnabled = true
let clickX, clickY; // Variables to store click coordinates  
let textSize = 10; // Initial text size  
let fadeOutRate = 1; // Rate at which the text size increases

let enemyMoving = true
let enemyCorridor = canvas.height / 12
const spawnRate = 5

//lataa kuvat
img_c.onload = function() {  
    imagesLoaded++
};  
img_c.src = './images/cactus.svg'

img_a.onload = function() {  
    imagesLoaded++
};  
img_a.src = './images/apple.svg'


function loadAvatar() {  
    const savedHeadColor = localStorage.getItem('headColor')
    const savedBaseColor = localStorage.getItem('baseColor')
    
    if (savedHeadColor) headColor = savedHeadColor
    if (savedBaseColor) baseColor = savedBaseColor
}

async function loadSVG(url) {  
    try {  
        const response = await fetch(url)
        if (!response.ok) {  
            throw new Error('Network response was not ok')
        }  
        const svgText = await response.text();  
        return svgText;  
    } catch (error) {  
        console.error('Error fetching the SVG:', error)
    }  
}

async function convertSVG() {
    loadAvatar();

    const svgUrl = './images/hero.svg'; 
    const originalSVG = await loadSVG(svgUrl)

    if (originalSVG) {  
        // korvaa tietyn värin svg:stä
        let modifiedSVG = replaceColor(originalSVG, '#f2b359', baseColor) // paidan väri
        modifiedSVG = replaceColor(modifiedSVG, '#f0d876', headColor) // pään väri

        // luo kuvan muokatun svg:n perusteella
        const svgBlob = new Blob([modifiedSVG], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob);  

        img_h.onload = function() {  
            imagesLoaded++
        };  

        img_h.src = url; // lataa svg:n kuvana  
    }  
}  

function replaceColor(svg, targetColor, newColor) {  
    return svg.replace(new RegExp(targetColor, 'g'), newColor)
}

function resizeCanvas() {  
    const aspectRatio = 17 / 10;  
    if (window.innerWidth * aspectRatio < window.innerHeight) {  
        canvas.width = window.innerWidth
        canvas.height = window.innerWidth * aspectRatio - padding
    } else {  
        canvas.height = window.innerHeight - padding
        canvas.width = window.innerHeight / aspectRatio - padding
    }  

    enemyCorridor = canvas.height / 12
    resetPlayer();
}  

function resetPlayer() {  
    player.x = canvas.width / 2
    player.y = canvas.height / 2
    target.x = player.x
    target.y = player.y
}  

function generateApples() {  
    apples.length = 0
    for (let i = 0; i < 3; i++) { 
        let apple;
        do {
            apple = {
                x: Math.random() * (canvas.width - 18) + 9,  
                y: Math.random() * (canvas.height - 18) + 9,  
                size: 18,  
                harvested: false 
            }
        } while (isInProximity_cacti(apple.x, apple.y))
        apples.push(apple)
    }  

    generateCacti()
    applesReadyForHarvesting = true// Only harvest once per round

    
} 

function generateCacti() {
    for (let i = 0; i < 2; i++) {
        let cactus
        do {
            cactus = getCoordsForCactus()
        } while (isInProximity(cactus.x, cactus.y))
        cacti.push(cactus)
    }
}

function generateEnemy() {
    const tempEnemyCorridor = Math.floor(Math.random() * 11)
    const enemy = {
        x: 0,
        y: enemyCorridor * tempEnemyCorridor + padding,
        size: 15,
        speed: Math.random() + 0.5,
        dir: 1,
        corridor: tempEnemyCorridor
    }
    enemies.push(enemy)
}

function getCoordsForCactus() {
    let cactus;
    const roll = Math.random()

    if (cacti.length > 2 && roll < chanceSpawnNextToExisting) {
        let index = Math.floor(Math.random() * (cacti.length - 1))

        cactus = {
                x: clamp((Math.random() * 48) + cacti[index].x - 24, 12, canvas.width - 12),
                y: clamp((Math.random() * 48) + cacti[index].y - 24, 12, canvas.height - 12),
                size: 24
            }

        return cactus
    }
    cactus = {
                x: Math.random() * (canvas.width - 24) + 12,
                y: Math.random() * (canvas.height - 24) + 12,
                size: 24
            }

    return cactus
}

function clamp(value, min, max) {  
    return Math.max(min, Math.min(max, value));  
}

function isInProximity(x, y) {  
    //tarkista läheisyys pelaajaan
    const dxPlayer = x - player.x;  
    const dyPlayer = y - player.y;  
    const distanceToPlayer = Math.sqrt(dxPlayer * dxPlayer + dyPlayer * dyPlayer);  
    if (distanceToPlayer < player.size + safeBuffer) return true; 

    //tarkista etäisyys omeniin
    for (let apple of apples) {  
        const dxapple = x - apple.x;  
        const dyapple = y - apple.y;  
        const distanceToApple = Math.sqrt(dxapple * dxapple + dyapple * dyapple);  
        if (distanceToApple < safeBuffer + apple.size) return true; 
    }  

    return false;  
}

function isInProximity_cacti(x, y) {  
    //tarkista etäisyys kaktuksiin 
    for (let cactus of cacti) {  
        const dxcactus = x - cactus.x;  
        const dycactus = y - cactus.y;  
        const distanceToCactus = Math.sqrt(dxcactus * dxcactus + dycactus * dycactus);  
        if (distanceToCactus < safeBuffer + cactus.size) return true; 
    }  

    return false;  
}

function update() {  
    if (moving) {  
        const dx = target.x - player.x;  
        const dy = target.y - player.y;  
        const distance = Math.sqrt(dx * dx + dy * dy);  
        if (distance > player.speed) {  
            player.x += (dx / distance) * player.speed;  
            player.y += (dy / distance) * player.speed;  
        } else {  
            moving = false;  
        }  
    }

    if (enemyMoving) {
        for (let enemy of enemies) {
            if (enemy.x>=canvas.width) {
                enemy.dir = -1
            }
            else if (enemy.x<=0) {
                enemy.dir = 1
            }
            enemy.x += enemy.speed * enemy.dir;
        }
    }

    for (let apple of apples) {  
        if (!apple.harvested && applesReadyForHarvesting) {  
            const dx = apple.x - player.x;  
            const dy = apple.y - player.y;  
            const distance = Math.sqrt(dx * dx + dy * dy);  
            if (distance < player.size + apple.size) {  
                apple.harvested = true;  
                harvestedCount++;  
                document.getElementById('counter').innerText = harvestedCount;  

                //Onko kaikki 3 omenaa kerätty?
                if (harvestedCount % 3 === 0 && harvestedCount > 0 && applesReadyForHarvesting) {  
                    applesReadyForHarvesting = false; //estää keräilyn tilapäisesti
                    setTimeout(generateApples, 100); //luo uusia omenoita pienen viiveen jälkeen
                }

                if (harvestedCount % spawnRate === 2) setTimeout(generateEnemy(), 100)
            }  
        }  
    } 
    
    //törmäyksen tarkistus, staattiset kaktukset 
    for (let cactus of cacti) {  
        const dxcactus = cactus.x - player.x;  
        const dycactus = cactus.y - player.y;  
        const distanceTocactus = Math.sqrt(dxcactus * dxcactus + dycactus * dycactus);  
        if (distanceTocactus < player.size/2 + cactus.size) {  
            gameOver();  
        }  
    }

    for (let enemy of enemies) {
        //törmäyksen tarkistus, liikkuvat kaktukset
        let distanceToEnemy = Math.sqrt((enemy.x - player.x) * (enemy.x - player.x) + (enemy.y - player.y) * (enemy.y - player.y));
        if (distanceToEnemy < player.size + enemy.size) {
            gameOver();
        }
    }
}  

function gameOver() {  
    document.getElementById('gameOverMessage').style.display = 'block';  
    moving = false;  
    applesReadyForHarvesting = false
    playingEnabled = false
    cacti.length = 0 //poistaa kaktukset
    enemies.length = 0 //poistaa liikkuvat kaktukset
}  

function draw() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);  


    if (imagesLoaded==3) {
        ctx.drawImage(img_h, player.x-player.size, player.y-player.size, player.size*2, player.size*2);
    }
    else {
        ctx.fillStyle = 'blue';  
        ctx.beginPath();  
        ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);  
        ctx.fill();
    }

    for (let apple of apples) {  
        if (!apple.harvested) {  
            if (imagesLoaded==3) {
                ctx.drawImage(img_a, apple.x - apple.size / 2, apple.y - apple.size / 2, apple.size, apple.size);
            }
            else {
                ctx.fillStyle = 'red';  
                ctx.beginPath();  
                ctx.arc(apple.x, apple.y, apple.size, 0, Math.PI * 2);  
                ctx.fill();
            }
                
        }  
    }  

    for (let cactus of cacti) { 
        if (imagesLoaded==3) {
            ctx.drawImage(img_c, cactus.x-cactus.size /2, cactus.y-cactus.size /2, cactus.size, cactus.size)
        }
        else{
            ctx.fillStyle = 'green' 
            ctx.fillRect(cactus.x - cactus.size / 2, cactus.y - cactus.size / 2, cactus.size, cactus.size)
        }  
    }

    for (let enemy of enemies) {
        drawEnemy(enemy)
    }

    if (!playingEnabled && textSize > 0) {  
        ctx.font = `${textSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'black' // tekstin väri 
        ctx.fillText('Click \'New Game\'', clickX, clickY)
    }  
}

function drawEnemy(enemy) {
    if (imagesLoaded==3) {
        ctx.drawImage(img_c, enemy.x-enemy.size, enemy.y-enemy.size, enemy.size*2, enemy.size*2)
    }
    else {
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2)
        ctx.fill();
    }
}

function gameLoop() {  
    update()
    draw()
    requestAnimationFrame(gameLoop)
}

function showNewGameText() {  
    textSize = 10 // Reset text size  

    //Suurenna tekstiä
    let startTime = Date.now() 
    const duration = 2000 // 2 seconds  

    function animate() {  
        const elapsed = Date.now() - startTime  
        if (elapsed < duration) {  
            textSize = 10 + (elapsed / duration) * 30 //Suurenna tekstiä kunnes maksimi saavutettu (30)
            draw() // Redraw the canvas  
            requestAnimationFrame(animate) //jatka animaation suorittamista 
        } else {  
            // Optionally clear state if needed after animation  
            textSize = 0 //tekstiä ei näytetä kun koko 0 
            draw() // Clear the canvas or reset drawing if needed  
        }  
    }  
    animate()
}  

canvas.addEventListener('click', (event) => {
    if (playingEnabled) {
        const rect = canvas.getBoundingClientRect()
        target.x = event.clientX - rect.left
        target.y = event.clientY - rect.top
        moving = true
    }
    else {
        clickX = event.clientX - canvas.getBoundingClientRect().left
        clickY = event.clientY - canvas.getBoundingClientRect().top
        showNewGameText()
    }
});  

startBtn.addEventListener('click', () => {
    document.getElementById('gameOverMessage').style.display = 'none'
    cacti.length = 0
    harvestedCount = 0
    document.getElementById('counter').innerText = harvestedCount
    resetPlayer()
    generateApples()
    playingEnabled = true
});

convertSVG();
window.addEventListener('resize', resizeCanvas)
resizeCanvas()
generateApples()
gameLoop()