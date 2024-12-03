import gsap from 'gsap';

interface CommandMap {
    [key: string]: () => string;
}

interface Article {
    name: string;
    url: string;
    imageUrl: string;
}

class Terminal {
    private commandInput: HTMLInputElement;
    private commandHistory: HTMLElement;
    private terminalContent: HTMLElement;
    private commandsHistory: string[] = [];
    private historyIndex: number = -1;
    private webglContext: WebGLRenderingContext | null = null;
    private previewCanvas: HTMLCanvasElement | null = null;

    private commands: CommandMap = {
        help: (): string => {
            const commands = [
                ['help', 'Display this help message'],
                ['clear', 'Clear terminal screen'],
                ['projects', 'View GitHub projects'],
                ['writes', 'View Medium writeups'],
                ['social', 'View social links'],
                ['ascii', 'Display ASCII art'],
                ['matrix', 'Activate Matrix mode']
            ];
            
            return commands.map(([cmd, desc]) => 
                `${cmd.padEnd(12)} ${desc}`
            ).join('\n');
        },
        
        projects: (): string => {
            const projects = [
                {name: "Project 1", url: "https://github.com/whitehatmafia/project1"},
                {name: "Project 2", url: "https://github.com/whitehatmafia/project2"},
                // Add your actual project URLs here
            ];
            
            return projects.map(p => 
                `<a href="${p.url}" class="project-link" target="_blank">→ ${p.name}</a>`
            ).join('\n');
        },
        
        writes: (): string => {
            const articles: Article[] = [
                {
                    name: "Article 1",
                    url: "https://medium.com/@whitehatmafia/article1",
                    imageUrl: "/images/article1.jpg" // Update with actual image paths
                },
                {
                    name: "Article 2",
                    url: "https://medium.com/@whitehatmafia/article2",
                    imageUrl: "/images/article2.jpg" // Update with actual image paths
                }
            ];
            
            this.initWebGL();
            
            return articles.map(article => `
                <div class="article-preview" 
                     data-image="${article.imageUrl}"
                     onmouseover="window.showArticlePreview(event, '${article.imageUrl}')"
                     onmouseout="window.hideArticlePreview()">
                    <a href="${article.url}" class="writeup-link" target="_blank">→ ${article.name}</a>
                    <canvas class="preview-canvas" width="200" height="120" style="display: none;"></canvas>
                </div>
            `).join('\n');
        },
        
        clear: (): string => {
            this.commandHistory.innerHTML = '';
            return '';
        },
        
        social: (): string => `Connect with me:
    GitHub: https://github.com/whitehatmafia
    Medium: https://medium.com/@whitehatmafia`,
        
        ascii: (): string => `
    ██╗    ██╗██╗  ██╗██╗████████╗███████╗██╗  ██╗ █████╗ ████████╗
    ██║    ██║██║  ██║██║╚══██╔══╝██╔════╝██║  ██║██╔══██╗╚══██╔══╝
    ██║ █╗ ██║███████║██║   ██║   █████╗  ███████║███████║   ██║   
    ██║███╗██║██╔══██║██║   ██║   ██╔══╝  ██╔══██║██╔══██║   ██║   
    ╚███╔███╔╝██║  ██║██║   ██║   ███████╗██║  ██║██║  ██║   ██║   
     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
        `,
        
        matrix: (): string => {
            this.startMatrixEffect();
            return 'Matrix mode activated...';
        }
    };

    constructor() {
        console.log('Initializing Terminal...');
        // Ensure terminal is visible first
        const terminal = document.getElementById('terminal');
        if (terminal) {
            terminal.style.visibility = 'visible';
            terminal.style.opacity = '1';
        }
        
        this.commandInput = document.getElementById('command-input') as HTMLInputElement;
        this.commandHistory = document.getElementById('command-history') as HTMLElement;
        this.terminalContent = document.getElementById('terminal-content') as HTMLElement;

        if (!this.commandInput || !this.commandHistory || !this.terminalContent) {
            console.error('Required DOM elements not found');
            return;
        }
        
        if (this.terminalContent) {
            this.terminalContent.style.visibility = 'visible';
        }
        
        // Start matrix effect on load
        setTimeout(() => {
            this.startMatrixEffect();
        }, 500);
        
        this.initializeEventListeners();
        // Comment out animations temporarily
        // this.initializeAnimations();
        
        // Add initialization message
        this.showInitMessage();
    }

    private showInitMessage(): void {
        const initMessages = [
            "Initializing secure connection...",
            "Accessing terminal...",
            "Systems online.",
            "Type 'help' for available commands."
        ];

        let delay = 0;
        initMessages.forEach((msg) => {
            setTimeout(() => {
                const msgElement = this.createOutputElement(msg);
                msgElement.classList.add('system-message');
                this.commandHistory.appendChild(msgElement);
            }, delay);
            delay += 500; // Add 500ms delay between each message
        });

        // Execute help command after init messages
        setTimeout(() => {
            this.executeCommand('help');
        }, delay);
    }

    private initializeEventListeners(): void {
        this.commandInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const command = this.commandInput.value;
                this.executeCommand(command);
                this.commandInput.value = '';
            }
        });

        this.commandInput.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });

        document.getElementById('terminal')?.addEventListener('click', () => {
            this.commandInput.focus();
        });

        // Add Ctrl+L shortcut to clear terminal
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.executeCommand('clear');
            }
        });

        // Add Tab completion
        this.commandInput.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabCompletion();
            }
        });
    }

    private handleTabCompletion(): void {
        const input = this.commandInput.value;
        const availableCommands = Object.keys(this.commands);
        const matches = availableCommands.filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            this.commandInput.value = matches[0];
        }
    }

    private addCopyToClipboard(): void {
        const outputs = document.querySelectorAll('.command-output');
        outputs.forEach(output => {
            output.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(output.textContent || '');
                    this.showNotification('Copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        });
    }

    private showNotification(message: string): void {
        const notification = document.createElement('div');
        notification.className = 'terminal-notification';
        notification.textContent = message;
        this.terminalContent.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2000);
    }

    private initializeAnimations(): void {
        gsap.from('#terminal', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            onComplete: () => {
                this.terminalContent.style.visibility = 'visible';
            }
        });

        gsap.from('.terminal-header', {
            duration: 0.5,
            opacity: 0,
            delay: 0.5,
            ease: 'power2.out'
        });

        gsap.from('.output', {
            duration: 0.5,
            opacity: 0,
            y: 20,
            stagger: 0.2,
            delay: 1,
            ease: 'power2.out'
        });
    }

    private createOutputElement(content: string, isCommand: boolean = false): HTMLDivElement {
        const outputDiv = document.createElement('div');
        outputDiv.className = isCommand ? 'input-line' : 'command-output';
        
        if (isCommand) {
            outputDiv.innerHTML = `<span class="prompt">visitor@whitehat:~$</span> ${this.sanitizeHTML(content)}`;
        } else {
            outputDiv.innerHTML = content; // Allow HTML in command output
        }
        
        return outputDiv;
    }

    private sanitizeHTML(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private async typeWriter(element: HTMLElement, text: string, speed: number = 30): Promise<void> {
        let i = 0;
        element.innerHTML = '';

        // If this is command output (not an input line), render HTML directly
        if (!element.classList.contains('input-line')) {
            element.innerHTML = text;
            return Promise.resolve();
        }

        // For input lines, use character-by-character typing
        return new Promise(resolve => {
            const typing = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    resolve();
                }
            }, speed);
        });
    }

    private navigateHistory(direction: 'up' | 'down'): void {
        if (direction === 'up' && this.historyIndex < this.commandsHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = this.commandsHistory[this.commandsHistory.length - 1 - this.historyIndex] || '';
        } else if (direction === 'down' && this.historyIndex > -1) {
            this.historyIndex--;
            this.commandInput.value = this.commandsHistory[this.commandsHistory.length - 1 - this.historyIndex] || '';
        }
    }

    private addToHistory(command: string): void {
        if (command.trim()) {
            this.commandsHistory.push(command);
            this.historyIndex = -1;
        }
    }

    private async executeCommand(command: string): Promise<void> {
        const cmd = command.toLowerCase().trim();
        
        if (cmd) {
            this.addToHistory(command);
            
            const commandElement = this.createOutputElement('', true);
            this.commandHistory.appendChild(commandElement);
            await this.typeWriter(commandElement, `${command}`, 20);
            
            if (cmd in this.commands) {
                const output = this.commands[cmd]();
                if (output) {
                    const outputElement = this.createOutputElement('');
                    this.commandHistory.appendChild(outputElement);
                    
                    // Handle different commands differently
                    switch(cmd) {
                        case 'projects':
                        case 'writes':
                            // These commands need HTML rendering
                            outputElement.innerHTML = output;
                            break;
                        default:
                            // For help, social, and other commands - use text
                            outputElement.innerText = output;
                    }
                }
            } else {
                const errorElement = this.createOutputElement('');
                this.commandHistory.appendChild(errorElement);
                errorElement.innerText = `Command not found: ${cmd}`;
            }
            
            this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
        }
    }

    private initWebGL(): void {
        if (!this.previewCanvas) {
            this.previewCanvas = document.createElement('canvas');
            this.previewCanvas.width = 200;
            this.previewCanvas.height = 120;
            this.webglContext = this.previewCanvas.getContext('webgl');
            
            // Initialize WebGL context and shaders
            if (this.webglContext) {
                this.initShaders();
                window.showArticlePreview = this.showArticlePreview.bind(this);
                window.hideArticlePreview = this.hideArticlePreview.bind(this);
            }
        }
    }

    private initShaders(): void {
        if (!this.webglContext) return;

        const vertexShader = `
            attribute vec2 position;
            attribute vec2 texCoord;
            varying vec2 vTexCoord;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
                vTexCoord = texCoord;
            }
        `;

        const fragmentShader = `
            precision mediump float;
            varying vec2 vTexCoord;
            uniform sampler2D uTexture;
            void main() {
                gl_FragColor = texture2D(uTexture, vTexCoord);
            }
        `;

        // Create and compile shaders
        // Add WebGL shader compilation code here
    }

    private showArticlePreview(event: MouseEvent, imageUrl: string): void {
        if (!this.previewCanvas || !this.webglContext) return;

        const target = event.currentTarget as HTMLElement;
        const canvas = target.querySelector('canvas');
        if (!canvas) return;

        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.left = `${event.pageX + 20}px`;
        canvas.style.top = `${event.pageY + 20}px`;

        // Load and render image using WebGL
        const image = new Image();
        image.onload = () => this.renderPreview(image);
        image.src = imageUrl;
    }

    private hideArticlePreview(): void {
        const canvases = document.querySelectorAll('.preview-canvas');
        canvases.forEach(canvas => (canvas as HTMLElement).style.display = 'none');
    }

    private renderPreview(image: HTMLImageElement): void {
        // Add WebGL rendering code here
    }

    private startMatrixEffect(): void {
        document.body.classList.add('matrix-mode');
        // Keep matrix effect longer on initial load
        setTimeout(() => document.body.classList.remove('matrix-mode'), 8000);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const terminal = new Terminal();
    
    // Show initial help message
    setTimeout(() => {
        terminal['executeCommand']('help');
    }, 1500);
});

declare global {
    interface Window {
        showArticlePreview: (event: MouseEvent, imageUrl: string) => void;
        hideArticlePreview: () => void;
    }
}

export {};
