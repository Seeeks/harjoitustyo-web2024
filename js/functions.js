const canvas = document.getElementById('avatarCanvas');  
const ctx = canvas.getContext('2d');
const starContainer = document.getElementById('starContainer');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

const DEFAULT_COLOR1 = '#aaaaaa'; //harmaa
const DEFAULT_COLOR2 = '#888888';
let headColor = DEFAULT_COLOR1;  
let baseColor = DEFAULT_COLOR2;

const DEFAULT_EYE = 1;
let selectedEyes = DEFAULT_EYE;

const DEFAULT_MOUTH = 1;
let selectedMouth = DEFAULT_MOUTH;

let bgColor = 'white';

//Piirretään avatar  
function drawAvatar() {  
    // Clear canvas  
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw base  
    ctx.fillStyle = baseColor;  
    ctx.beginPath();  
    ctx.ellipse(canvas.width/2, canvas.height, canvas.width/2-20, canvas.height/3.2, 0, 0, Math.PI * 2);//x, y, radiusX, radiusY, rotation, startAngle, endAngle
    ctx.fill();  

    // Draw head  
    ctx.fillStyle = headColor;  
    ctx.beginPath();  
    ctx.ellipse(canvas.width/2, canvas.height/2-2, canvas.width/2.11, canvas.height/2.35, 0, 0, Math.PI * 2);  
    ctx.fill();

    drawSVG('./images/eyes' + selectedEyes + '.svg');
    drawSVG('./images/mouth' + selectedMouth + '.svg');
}

function drawSVG(filename) {
    const img = new Image();
    img.src = filename;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

//Värin valinnan käsittely 
document.querySelectorAll('.color-option').forEach(option => {  
    option.addEventListener('click', (e) => {  
        const selectedColor = e.target.getAttribute('data-color');
        
        const parent = e.target.parentElement;

        if (parent.id=="colorOptions-head") {
            headColor = selectedColor;
        }
        else if (parent.id=="colorOptions-bg") {
            bgColor = selectedColor;
        }
        else {
            baseColor = selectedColor;
        }
        
        drawAvatar();  
        
    });  
});

document.querySelectorAll('.eye-option').forEach(option => {  
    option.addEventListener('click', (e) => {  
        selectedEyes = Number(e.target.getAttribute('data-eye'));
        
        drawAvatar();  
        
    });  
});

document.querySelectorAll('.mouth-option').forEach(option => {  
    option.addEventListener('click', (e) => {  
        selectedMouth = Number(e.target.getAttribute('data-mouth'));
        
        drawAvatar();  
        
    });  
});

// Save selections to local storage
if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {  
        localStorage.setItem('headColor', headColor);  
        localStorage.setItem('baseColor', baseColor);
        localStorage.setItem('eye', selectedEyes);
        localStorage.setItem('mouth', selectedMouth);
        localStorage.setItem('bgColor', bgColor);
    
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.innerHTML = "Saved!";
        
        spawnStars(e);
        //start a 4 second timer, after which the button text will be reset
        setTimeout(() => {
            saveBtn.innerHTML = "Save";
        }, 4000);
    });  
}


// Reset to defaults
if (resetBtn) {
    resetBtn.addEventListener('click', () => {  
        localStorage.removeItem('headColor');  
        localStorage.removeItem('baseColor'); 
        localStorage.removeItem('eye');
        localStorage.removeItem('mouth');
        localStorage.removeItem('bgColor');
    
        headColor = DEFAULT_COLOR1;  
        baseColor = DEFAULT_COLOR2;
        selectedEyes = DEFAULT_EYE;
        selectedMouth = DEFAULT_MOUTH;
        bgColor = 'white';
    
        drawAvatar(); 
    });  
}


//Valintojen hakeminen local storagesta
function loadAvatar() {  
    const savedHeadColor = localStorage.getItem('headColor');  
    const savedBaseColor = localStorage.getItem('baseColor');
    const savedBgColor = localStorage.getItem('bgColor');
    const savedEye = localStorage.getItem('eye');
    const savedMouth = localStorage.getItem('mouth');
    
    if (savedEye) selectedEyes = Number(savedEye);
    if (savedMouth) selectedMouth = Number(savedMouth);
    if (savedHeadColor) headColor = savedHeadColor;  
    if (savedBaseColor) baseColor = savedBaseColor;
    if (savedBgColor) bgColor = savedBgColor;

    drawAvatar();  
}

function spawnStars(e) {
    starContainer.style.pointerEvents = 'auto'; // Enable events to create stars  
    
    const numberOfStars = 30; // Number of stars to create  
    const rect = starContainer.getBoundingClientRect();  
    const centerX = e.clientX - rect.left;  
    const centerY = e.clientY - rect.top;  

    for (let i = 0; i < numberOfStars; i++) {  
        const star = document.createElement('div');  
        star.classList.add('five-pointed-star');  

        // Set initial position and size  
        star.style.left = `${centerX}px`;  
        star.style.top = `${centerY}px`;  
        star.style.fontSize = `${Math.random() * 2 + 1}em`;  

        // Random angle and distance  
        const angle = Math.random() * 360;  
        const distance = Math.random() * 100 + 50;  
        const duration = Math.random() * 0.5 + 0.5;  

        star.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;  
        star.style.opacity = '0.5';  

        starContainer.appendChild(star);  

        // Remove star after animation  
        setTimeout(() => {  
            star.remove();  
            // If no more stars, disable pointer events  
            if (starContainer.children.length === 0) {  
                starContainer.style.pointerEvents = 'none';  
            }  
        }, duration * 1000);  
    }  
}

function updateStarContainerHeight() {  
    if (starContainer) {
        starContainer.style.height = `${document.body.scrollHeight}px`; // Set to document height 
    }
}  

// Call this function on DOMContentLoaded to set initial height  
document.addEventListener('DOMContentLoaded', updateStarContainerHeight);  

// Optionally call it on resize if the layout can change  
window.addEventListener('resize', updateStarContainerHeight);

// Initialize the avatar on page load  
loadAvatar();  