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
// custom.js
document.addEventListener('DOMContentLoaded', () => {
  // Existing Matrix Rain Effect Code
  const randomChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    return chars[Math.floor(Math.random() * chars.length)];
  };

  const createMatrixRain = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.05';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops = [];
    const fontSize = 10;
    const columns = canvas.width / fontSize;

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = randomChar();
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(draw);
    }

    draw();
  };

  // Terminal Class Implementation
  class Terminal {
    constructor() {
      this.input = document.getElementById('terminal-input');
      this.output = document.getElementById('terminal-output');
      this.history = [];
      this.historyIndex = -1;
      this.initializeEventListeners();
    }

initializeEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand();
            } else if (e.key === 'ArrowUp') {
                this.navigateHistory('up');
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                this.navigateHistory('down');
                e.preventDefault();
            }
        });

        // Handle window resize for matrix effect
        window.addEventListener('resize', () => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });
    }

    handleCommand() {
        const command = this.input.value.trim().toLowerCase();
        if (command) {
            this.history.push(command);
            this.historyIndex = this.history.length;
            this.addToOutput(`❯ ${command}`);
            this.processCommand(command);
        }
        this.input.value = '';
    }

    processCommand(command) {
        const commands = {
            help: () => {
                this.addToOutput(`Available commands:
                    - about: Learn about me
                    - projects: View my projects
                    - contact: Get in touch
                    - skills: View my technical skills
                    - clear: Clear terminal
                    - ls: List available sections
                    - cd [section]: Navigate to section`);
            },
            about: () => {
                gsap.to(window, {
                    duration: 0.5,
                    scrollTo: "#about",
                    ease: "power2.inOut"
                });
                this.addToOutput('Navigating to About section...');
            },
            projects: () => {
                gsap.to(window, {
                    duration: 0.5,
                    scrollTo: "#projects",
                    ease: "power2.inOut"
                });
                this.addToOutput('Loading projects...');
            },
            contact: () => {
                gsap.to(window, {
                    duration: 0.5,
                    scrollTo: "#contact",
                    ease: "power2.inOut"
                });
                this.addToOutput('Opening contact information...');
            },
            
            clear: () => {
                this.output.innerHTML = '';
                return null;
            },
            ls: () => {
                this.addToOutput(`
                    📁 Available sections:
                    - about/
                    - projects/
                    - posts/
                    - contact/
                `);
            },
            skills: () => {
                this.addToOutput(`
                    🔧 Technical Skills:
                    - Security Research
                    - Penetration Testing
                    - Malware Analysis
                    - Network Security
                    - Web Security
                `);
            }
        };

        const commandName = command.split(' ')[0];
        if (commandName in commands) {
            const result = commands[commandName]();
            if (result) {
                this.addToOutput(result);
            }
        } else {
            this.addToOutput(`Command not found: ${command}. Type 'help' for available commands.`);
        }
    }

    addToOutput(text) {
        const line = document.createElement('div');
        line.className = 'terminal-output';
        line.textContent = text;
        this.output.appendChild(line);
        
        // Scroll to bottom
        this.output.scrollTop = this.output.scrollHeight;
        
        // Animate new line with GSAP
        gsap.fromTo(line, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.history.length - 1) {
            this.historyIndex = this.history.length;
            this.input.value = '';
        }
    }
}

    // Initialize Matrix effect and Terminal
    createMatrixRain();
    const terminal = new Terminal();
     // Welcome sequence with staggered animations
    const welcomeMessages = [
        'Welcome to WhiteHat Mafia Terminal 🚀',
        'Type "help" to see available commands',
        'Type "ls" to see available sections'
    ];

    gsap.from('.header', {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: "power2.out"
    });
    
    gsap.from('#terminal', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        onComplete: () => {
            // Add welcome messages with staggered animation
            welcomeMessages.forEach((msg, index) => {
                setTimeout(() => {
                    terminal.addToOutput(msg);
                }, index * 500);
            });
        }
    });

    // Handle mobile touch events
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', () => {
            const input = document.getElementById('terminal-input');
            input.focus();
        });
    }

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            gsap.globalTimeline.pause();
        } else {
            // Resume animations when tab becomes visible
            gsap.globalTimeline.resume();
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        // Cleanup any resources if needed
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.remove();
        }
    });
});
