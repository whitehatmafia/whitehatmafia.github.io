// animations.js

// Configuration object for customizable settings
const MATRIX_CONFIG = {
    fontSize: 10,
    opacity: 0.05,
    color: '#0F0',
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%',
    fadeSpeed: 0.04,
    dropSpeed: 0.975
};

class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.animationFrame = null;
    }

    initialize() {
        this.setupCanvas();
        this.initializeDrops();
        this.startAnimation();
        this.handleResize();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1',
            opacity: MATRIX_CONFIG.opacity.toString()
        });

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initializeDrops() {
        const columns = Math.floor(this.canvas.width / MATRIX_CONFIG.fontSize);
        this.drops = Array(columns).fill(1);
    }

    draw() {
        // Create fade effect
        this.ctx.fillStyle = `rgba(0, 0, 0, ${MATRIX_CONFIG.fadeSpeed})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set text properties
        this.ctx.fillStyle = MATRIX_CONFIG.color;
        this.ctx.font = `${MATRIX_CONFIG.fontSize}px monospace`;

        // Draw characters
        this.drops.forEach((drop, i) => {
            const char = MATRIX_CONFIG.characters[Math.floor(Math.random() * MATRIX_CONFIG.characters.length)];
            const x = i * MATRIX_CONFIG.fontSize;
            const y = drop * MATRIX_CONFIG.fontSize;

            // Add random brightness effect
            const brightness = Math.random() * 100;
            this.ctx.fillStyle = `hsl(120, 100%, ${brightness}%)`;
            
            this.ctx.fillText(char, x, y);

            // Reset drop when it reaches bottom or randomly
            if (y > this.canvas.height && Math.random() > MATRIX_CONFIG.dropSpeed) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        });

        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initializeDrops();
        });
    }

    startAnimation() {
        try {
            this.draw();
        } catch (error) {
            console.error('Error starting matrix animation:', error);
        }
    }

    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    cleanup() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

// Initialize the matrix effect
document.addEventListener('DOMContentLoaded', () => {
    try {
        const matrix = new MatrixRain();
        matrix.initialize();
  // Cleanup on page unload
        window.addEventListener('unload', () => {
            matrix.cleanup();
        });

        // Add performance optimization for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                matrix.stopAnimation();
            } else {
                matrix.startAnimation();
            }
        });

        // Add touch device detection and optimization
        if ('ontouchstart' in window) {
            MATRIX_CONFIG.dropSpeed = 0.99; // Slower drops for better mobile performance
            MATRIX_CONFIG.fadeSpeed = 0.08; // Faster fade for mobile
        }

        // Add FPS control for performance
        const FPS = 30;
        let then = Date.now();
        const interval = 1000 / FPS;

        function animateWithFPSLimit(currentTime) {
            requestAnimationFrame(animateWithFPSLimit);
            
            const now = Date.now();
            const delta = now - then;

            if (delta > interval) {
                then = now - (delta % interval);
                matrix.draw();
            }
        }

        // Start the FPS-controlled animation
        animateWithFPSLimit();

    } catch (error) {
        console.error('Failed to initialize Matrix Rain:', error);
        // Fallback to a simple background if animation fails
        document.body.style.backgroundColor = '#000';
    }
});

// Add debug mode
if (process.env.NODE_ENV === 'development') {
    window.matrixDebug = {
        config: MATRIX_CONFIG,
        toggleAnimation: function() {
            const matrix = document.querySelector('canvas');
            if (matrix.style.display === 'none') {
                matrix.style.display = 'block';
            } else {
                matrix.style.display = 'none';
            }
        },
        adjustSpeed: function(speed) {
            MATRIX_CONFIG.dropSpeed = speed;
        }
    };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatrixRain, MATRIX_CONFIG };
}
