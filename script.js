// Shuffle Snap - Image Puzzle Game
// ====================================

// Game Configuration
const CONFIG = {
    difficulties: {
        easy: { gridSize: 5, timeLimit: 180 },      // 3 minutes
        medium: { gridSize: 8, timeLimit: 300 },    // 5 minutes
        hard: { gridSize: 12, timeLimit: 600 }      // 10 minutes
    },
    previewTime: 5, // seconds to memorize image
    imageFolder: 'assets/images/',
    defaultImage: 'assets/default-puzzle.jpg'
};

// Game State
let gameState = {
    currentDifficulty: null,
    gridSize: 5,
    timeLimit: 60,
    timeLeft: 60,
    timerInterval: null,
    pieces: [],
    isPreviewing: false,
    isPlaying: false,
    selectedPiece: null,
    draggedPiece: null,
    dropTarget: null,
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    originalTransform: '',
    hintShowing: false  // Track if hint is currently showing
};

// Image Assets (you can add more images here)
const imageAssets = [
    'assets/nature.jpg',
    'assets/cityscape.jpg',
    'abstract-art.jpg',
    'animals-wildlife.jpg'
];

let currentImage = null;

// DOM Elements
let elements = {};

// Three.js animated background
let scene, camera, renderer, particles = [];

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initThreeJSBackground();
    setupEventListeners();
    animateBackground();
});

function initElements() {
    elements = {
        mainMenu: document.getElementById('main-menu'),
        difficultyScreen: document.getElementById('difficulty-screen'),
        gameScreen: document.getElementById('game-screen'),
        winScreen: document.getElementById('win-screen'),
        gameOverScreen: document.getElementById('game-over-screen'),
        
        startBtn: document.getElementById('start-btn'),
        backToMenu: document.getElementById('back-to-menu'),
        returnToMenu: document.getElementById('return-to-menu'),
        tryAgainBtn: document.getElementById('try-again-btn'),
        showHintBtn: document.getElementById('show-hint-btn'),
        
        previewContainer: document.getElementById('preview-container'),
        previewImage: document.getElementById('preview-image'),
        previewTimer: document.getElementById('preview-timer'),
        puzzleContainer: document.getElementById('puzzle-container'),
        puzzleBoard: document.getElementById('puzzle-board'),
        timeLeft: document.getElementById('time-left'),
        finalScore: document.getElementById('final-score'),
        feedbackMessage: document.getElementById('feedback-message')
    };
}

// ====================================
// THREE.JS ANIMATED BACKGROUND
// ====================================

function initThreeJSBackground() {
    const container = document.getElementById('animated-background');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create floating particles (representing puzzle pieces)
    const particleCount = 100;
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x48dbfb,
        transparent: true,
        opacity: 0.6
    });
    
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(geometry, material.clone());
        particle.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5
        );
        particle.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );
        particle.rotationSpeed = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05
        );
        scene.add(particle);
        particles.push(particle);
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
}

function animateBackground() {
    requestAnimationFrame(animateBackground);
    
    particles.forEach(particle => {
        particle.position.add(particle.velocity);
        particle.rotation.x += particle.rotationSpeed.x;
        particle.rotation.y += particle.rotationSpeed.y;
        particle.rotation.z += particle.rotationSpeed.z;
        
        // Wrap around screen
        if (particle.position.x > 5) particle.position.x = -5;
        if (particle.position.x < -5) particle.position.x = 5;
        if (particle.position.y > 5) particle.position.y = -5;
        if (particle.position.y < -5) particle.position.y = 5;
    });
    
    renderer.render(scene, camera);
}

// ====================================
// EVENT LISTENERS
// ====================================

function setupEventListeners() {
    // Main menu
    elements.startBtn.addEventListener('click', showDifficultyScreen);
    
    // Back buttons
    elements.backToMenu.addEventListener('click', showMainMenu);
    elements.returnToMenu.addEventListener('click', showMainMenu);
    elements.tryAgainBtn.addEventListener('click', showDifficultyScreen);
    
    // Difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => startGame(btn.dataset.difficulty));
    });
    
    // Hint button
    elements.showHintBtn.addEventListener('click', showHint);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ====================================
// SCREEN NAVIGATION
// ====================================

function showMainMenu() {
    hideAllScreens();
    elements.mainMenu.classList.remove('hidden');
}

function showDifficultyScreen() {
    hideAllScreens();
    elements.difficultyScreen.classList.remove('hidden');
}

function showGameScreen() {
    hideAllScreens();
    elements.gameScreen.classList.remove('hidden');
}

function showWinScreen(score, timeLeft) {
    hideAllScreens();
    elements.winScreen.classList.remove('hidden');
    elements.finalScore.textContent = score;
    
    // Generate feedback message based on performance
    const percentage = (timeLeft / gameState.timeLimit) * 100;
    let feedback = '';
    
    if (percentage > 75) {
        feedback = '🏆 AMAZING! You\'re a puzzle master! 🏆';
    } else if (percentage > 50) {
        feedback = '⭐ Great job! You solved it with style! ⭐';
    } else if (percentage > 25) {
        feedback = '👍 Good work! Keep practicing! 👍';
    } else {
        feedback = '💪 Not bad! You made it just in time! 💪';
    }
    
    elements.feedbackMessage.textContent = feedback;
}

function showGameOverScreen() {
    hideAllScreens();
    elements.gameOverScreen.classList.remove('hidden');
}

function hideAllScreens() {
    elements.mainMenu.classList.add('hidden');
    elements.difficultyScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.winScreen.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
}

// ====================================
// GAME LOGIC
// ====================================

async function startGame(difficulty) {
    const config = CONFIG.difficulties[difficulty];
    gameState.currentDifficulty = difficulty;
    gameState.gridSize = config.gridSize;
    gameState.timeLimit = config.timeLimit;
    gameState.timeLeft = config.timeLimit;
    gameState.isPlaying = false;
    
    // Select random image
    currentImage = await selectRandomImage();
    
    showGameScreen();
    await showPreview();
    createPuzzleBoard();
    startTimer();
}

async function selectRandomImage() {
    // List of available images in assets folder
    const availableImages = [
        'assets/default-puzzle.jpg',
        'assets/nature.jpg'
        // Add more images here as you add them to the assets folder
    ];
    
    // Try each image until one loads successfully
    for (const imgPath of availableImages) {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            // Wait for image to load or fail
            await new Promise((resolve, reject) => {
                img.onload = () => resolve(imgPath);
                img.onerror = () => reject(new Error(`Failed to load ${imgPath}`));
                img.src = imgPath;
                
                // Timeout after 2 seconds
                setTimeout(() => reject(new Error(`Timeout loading ${imgPath}`)), 2000);
            });
            
            console.log(`✅ Loaded image: ${imgPath}`);
            return imgPath;
        } catch (e) {
            console.log(`❌ Image not available: ${imgPath}`);
        }
    }
    
    // Fallback to a placeholder image if nothing works
    console.log('⚠️ Using fallback placeholder image');
    return 'https://picsum.photos/800/800';
}

async function showPreview() {
    gameState.isPreviewing = true;
    elements.previewContainer.classList.remove('hidden');
    elements.puzzleContainer.classList.add('hidden');
    
    // Set preview image
    elements.previewImage.style.backgroundImage = `url(${currentImage})`;
    
    // Countdown timer with scale animation
    let countdown = CONFIG.previewTime;
    elements.previewTimer.textContent = countdown;
    elements.previewTimer.classList.remove('scale-out');
    elements.previewTimer.classList.add('scale-in');
    
    const interval = setInterval(() => {
        countdown--;
        
        // Animate timer change
        elements.previewTimer.classList.remove('scale-in');
        elements.previewTimer.classList.add('scale-out');
        
        setTimeout(() => {
            elements.previewTimer.textContent = countdown;
            elements.previewTimer.classList.remove('scale-out');
            elements.previewTimer.classList.add('scale-in');
        }, 300);
        
        if (countdown <= 0) {
            clearInterval(interval);
            gameState.isPreviewing = false;
            elements.previewContainer.classList.add('hidden');
            elements.puzzleContainer.classList.remove('hidden');
        }
    }, 1000);
}

function createPuzzleBoard() {
    const gridSize = gameState.gridSize;
    const board = elements.puzzleBoard;
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    // Calculate optimal puzzle size (responsive) - account for padding and borders
    const maxSize = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 600);
    const paddingAndBorder = 34; // 15px padding * 2 + 2px border * 2 + some gap
    const actualSize = maxSize - paddingAndBorder;
    board.style.width = `${maxSize}px`;
    board.style.height = `${maxSize}px`;
    
    // Create pieces array with correct positions
    gameState.pieces = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            gameState.pieces.push({
                correctRow: row,
                correctCol: col,
                currentRow: row,  // Will be updated after shuffle
                currentCol: col,   // Will be updated after shuffle
                element: null
            });
        }
    }
    
    // Shuffle pieces
    shuffleArray(gameState.pieces);
    
    // AFTER shuffling, update current positions to match new shuffled order
    let index = 0;
    gameState.pieces.forEach((piece) => {
        piece.currentRow = Math.floor(index / gridSize);
        piece.currentCol = index % gridSize;
        index++;
    });
    
    // Create puzzle pieces
    gameState.pieces.forEach((piece, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'puzzle-piece';
        
        // Calculate piece size dynamically
        const paddingAndBorder = 34; // 15px padding * 2 + 2px border * 2 + some gap
        const actualSize = maxSize - paddingAndBorder;
        const pieceSize = actualSize / gridSize;
        
        pieceElement.style.width = `${pieceSize}px`;
        pieceElement.style.height = `${pieceSize}px`;
        pieceElement.style.backgroundImage = `url(${currentImage})`;
        
        // CRITICAL: Set background size to match the TOTAL puzzle dimensions
        // This ensures the image scales perfectly to fit the entire puzzle area
        pieceElement.style.backgroundSize = `${maxSize}px ${maxSize}px`;
        pieceElement.style.backgroundRepeat = 'no-repeat';
        pieceElement.style.backgroundPosition = 'center';
        
        // Calculate background position based on CORRECT position (what image part this piece shows)
        // Use percentage-based positioning for proper scaling
        const bgX = (piece.correctCol / (gridSize - 1)) * 100;
        const bgY = (piece.correctRow / (gridSize - 1)) * 100;
        pieceElement.style.backgroundPosition = `${bgX}% ${bgY}%`;
        
        // Store position data - CURRENT position is where it is NOW in the grid
        pieceElement.dataset.row = piece.currentRow;
        pieceElement.dataset.col = piece.currentCol;
        pieceElement.dataset.correctRow = piece.correctRow;
        pieceElement.dataset.correctCol = piece.correctCol;
        
        // Add drag events
        addDragEvents(pieceElement);
        
        board.appendChild(pieceElement);
        piece.element = pieceElement;
    });
    
    gameState.isPlaying = true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ====================================
// DRAG AND DROP
// ====================================

function addDragEvents(element) {
    // Mouse events for desktop drag-follow
    element.addEventListener('mousedown', handleDragStart);
    
    // Touch events for mobile
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
}

// Global mouse move and mouse up handlers
document.addEventListener('mousemove', handleDragMove);
document.addEventListener('mouseup', handleDragEnd);

function handleDragStart(e) {
    if (!gameState.isPlaying || gameState.isPreviewing) return;
    
    e.preventDefault(); // Prevent default drag behavior
    
    const piece = this;
    gameState.draggedPiece = piece;
    gameState.isDragging = true;
    
    // Store original position for animation
    const rect = piece.getBoundingClientRect();
    gameState.dragOffsetX = e.clientX - rect.left;
    gameState.dragOffsetY = e.clientY - rect.top;
    
    // Store original transform to restore later
    gameState.originalTransform = piece.style.transform || '';
    
    // Add dragging class and make it follow cursor using transform
    piece.classList.add('dragging');
    piece.style.zIndex = '1000';
    movePieceWithCursor(e.clientX, e.clientY);
}

function movePieceWithCursor(x, y) {
    if (!gameState.draggedPiece) return;
    
    const piece = gameState.draggedPiece;
    const rect = piece.getBoundingClientRect();
    const offsetX = gameState.dragOffsetX || 0;
    const offsetY = gameState.dragOffsetY || 0;
    
    // Calculate translation from original position
    const deltaX = x - offsetX - rect.left;
    const deltaY = y - offsetY - rect.top;
    
    // Use transform translate instead of position fixed
    piece.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.2) rotate(3deg)`;
}

function handleDragMove(e) {
    if (!gameState.isDragging || !gameState.draggedPiece) return;
    
    e.preventDefault();
    movePieceWithCursor(e.clientX, e.clientY);
    
    // Find piece under cursor for drop target (excluding the dragged piece)
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    let targetPiece = null;
    
    if (elementBelow) {
        // Check if it's a puzzle piece or inside one
        if (elementBelow.classList.contains('puzzle-piece')) {
            targetPiece = elementBelow;
        } else {
            // Try to find parent puzzle piece
            const parentPiece = elementBelow.closest('.puzzle-piece');
            if (parentPiece) {
                targetPiece = parentPiece;
            }
        }
    }
    
    // Remove drag-over from all pieces
    document.querySelectorAll('.puzzle-piece').forEach(p => {
        if (p !== gameState.draggedPiece && !p.classList.contains('dragging')) {
            p.classList.remove('drag-over');
        }
    });
    
    // Add drag-over to target piece
    if (targetPiece && targetPiece !== gameState.draggedPiece) {
        targetPiece.classList.add('drag-over');
        gameState.dropTarget = targetPiece;
    } else {
        gameState.dropTarget = null;
    }
}

function handleDragEnd(e) {
    if (!gameState.isDragging || !gameState.draggedPiece) return;
    
    e.preventDefault();
    
    const draggedPiece = gameState.draggedPiece;
    
    // Remove dragging class and reset transform
    draggedPiece.classList.remove('dragging');
    draggedPiece.style.zIndex = '';
    draggedPiece.style.transform = gameState.originalTransform || '';
    
    // Check if dropped on a valid target
    if (gameState.dropTarget && gameState.dropTarget !== draggedPiece) {
        animateSwap(draggedPiece, gameState.dropTarget);
    }
    
    // Clean up
    document.querySelectorAll('.puzzle-piece').forEach(piece => {
        piece.classList.remove('drag-over');
    });
    
    gameState.draggedPiece = null;
    gameState.dropTarget = null;
    gameState.isDragging = false;
}

// Touch events for mobile support
let touchStartPos = null;
let touchedElement = null;

function handleTouchStart(e) {
    if (!gameState.isPlaying || gameState.isPreviewing) return;
    
    e.preventDefault();
    touchedElement = this;
    const touch = e.touches[0];
    touchStartPos = {
        x: touch.clientX,
        y: touch.clientY
    };
    this.classList.add('dragging');
}

function handleTouchMove(e) {
    if (!touchedElement) return;
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!touchedElement || !touchStartPos) return;
    
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    
    // Get element at touch position
    const elem = document.elementFromPoint(endX, endY);
    if (elem && elem.classList.contains('puzzle-piece') && elem !== touchedElement) {
        swapPieces(touchedElement, elem);
        checkWinCondition();
    }
    
    touchedElement.classList.remove('dragging');
    touchedElement = null;
    touchStartPos = null;
}

function animateSwap(piece1, piece2) {
    // Add swapping class for smooth animation
    piece1.classList.add('swapping');
    piece2.classList.add('swapping');
    
    // Perform the actual swap (data only)
    swapPieces(piece1, piece2);
    
    // Remove drag-over styling
    piece2.classList.remove('drag-over');
    
    // Add pop animation after brief delay
    setTimeout(() => {
        piece1.classList.add('swap-complete');
        piece2.classList.add('swap-complete');
        
        // Clean up animation classes
        setTimeout(() => {
            piece1.classList.remove('swapping', 'swap-complete');
            piece2.classList.remove('swapping', 'swap-complete');
        }, 500);
    }, 400);
    
    // Check win condition after animation completes
    setTimeout(() => {
        checkWinCondition();
    }, 900);
}

function swapPieces(piece1, piece2) {
    // Get current positions (where pieces are NOW in the grid)
    const row1 = parseInt(piece1.dataset.row);
    const col1 = parseInt(piece1.dataset.col);
    const row2 = parseInt(piece2.dataset.row);
    const col2 = parseInt(piece2.dataset.col);
    
    // Swap the background positions (visual appearance - what image part they show)
    const bgPos1 = piece1.style.backgroundPosition;
    const bgPos2 = piece2.style.backgroundPosition;
    
    piece1.style.backgroundPosition = bgPos2;
    piece2.style.backgroundPosition = bgPos1;
    
    // Swap ONLY the current grid positions (where they are placed)
    // DO NOT swap correctRow/correctCol - those define the piece's IDENTITY!
    piece1.dataset.row = row2;
    piece1.dataset.col = col2;
    piece2.dataset.row = row1;
    piece2.dataset.col = col1;
    
    // Update gameState.pieces to reflect new positions
    updatePiecePositions();
}

function updatePiecePositions() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => {
        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);
        const pieceData = gameState.pieces.find(p => 
            p.correctRow === parseInt(piece.dataset.correctRow) &&
            p.correctCol === parseInt(piece.dataset.correctCol)
        );
        if (pieceData) {
            pieceData.currentRow = row;
            pieceData.currentCol = col;
        }
    });
}

// ====================================
// TIMER & SCORING
// ====================================

function startTimer() {
    updateTimeDisplay();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimeDisplay();
        
        // Visual warning when time is running low
        if (gameState.timeLeft <= 60) {
            elements.timeLeft.style.color = '#ff6b6b';
        } else {
            elements.timeLeft.style.color = '#fff';
        }
        
        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateTimeDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    elements.timeLeft.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function showHint() {
    // Prevent multiple hints from stacking
    if (gameState.hintShowing) return;
    
    gameState.hintShowing = true;
    
    // Briefly show the original image
    const hintOverlay = document.createElement('div');
    hintOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    const hintContainer = document.createElement('div');
    hintContainer.style.cssText = `
        text-align: center;
        animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    const hintText = document.createElement('h3');
    hintText.style.cssText = `
        color: #fff;
        margin-bottom: 20px;
        font-size: 24px;
        text-shadow: 0 2px 10px rgba(72, 219, 251, 0.8);
    `;
    hintText.textContent = '🔍 MEMORIZE THIS! 🔍';
    
    const hintImage = document.createElement('div');
    // Calculate size to fit within screen with padding
    const maxSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.7, 500);
    hintImage.style.cssText = `
        width: ${maxSize}px;
        height: ${maxSize}px;
        background-image: url(${currentImage});
        background-size: cover;
        background-position: center;
        border: 4px solid #48dbfb;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(72, 219, 251, 0.6), 
                    0 0 60px rgba(72, 219, 251, 0.3);
    `;
    
    hintContainer.appendChild(hintText);
    hintContainer.appendChild(hintImage);
    hintOverlay.appendChild(hintContainer);
    document.body.appendChild(hintOverlay);
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
        hintOverlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            hintOverlay.remove();
            gameState.hintShowing = false;
        }, 300);
    }, 2000);
}

// ====================================
// WIN CONDITION
// ====================================

function checkWinCondition() {
    const allCorrect = gameState.pieces.every(piece => 
        piece.currentRow === piece.correctRow &&
        piece.currentCol === piece.correctCol
    );
    
    if (allCorrect) {
        endGame(true);
    }
}

function endGame(isWin) {
    stopTimer();
    gameState.isPlaying = false;
    
    if (isWin) {
        // Calculate score: base score + time bonus
        const baseScore = 1000;
        const timeBonus = gameState.timeLeft * 10;
        const totalScore = baseScore + timeBonus;
        
        showWinScreen(totalScore, gameState.timeLeft);
    } else {
        showGameOverScreen();
    }
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

function getFeedbackMessage(timeLeft, timeLimit) {
    const percentage = (timeLeft / timeLimit) * 100;
    
    if (percentage > 75) {
        return "🏆 AMAZING! You're a puzzle master! 🏆";
    } else if (percentage > 50) {
        return "⭐ Great job! You solved it with style! ⭐";
    } else if (percentage > 25) {
        return "👍 Good work! Keep practicing! 👍";
    } else {
        return "💪 Not bad! You made it just in time! 💪";
    }
}
