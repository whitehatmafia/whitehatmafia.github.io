import gsap from 'gsap';

interface CommandMap {
    [key: string]: () => string | boolean;
}

interface Article {
    name: string;
    url: string;
    imageUrl: string;
}

class Terminal {
    private readonly asciiArt = `
[*] ██╗    ██╗██╗  ██╗██╗████████╗███████╗    ██╗  ██╗ █████╗ ████████╗
[*] ██║    ██║██║  ██║██║╚══██╔══╝██╔════╝    ██║  ██║██╔══██╗╚══██╔══╝
[*] ██║ █╗ ██║███████║██║   ██║   █████╗      ███████║██████��║   ██║   
[*] ██║███╗██║██╔══██║██║   ██║   ██╔��═╝      ██╔══██║██╔══██║   ██║   
[*] ╚███╔███╔╝██║  ██║██║   ██║   ███████╗    ██║  ██║██║  ██║   ██║   
[*]  ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
    `;

    private commandInput!: HTMLInputElement;
    private commandHistory!: HTMLElement;
    private terminalContent!: HTMLElement;
    private commandsHistory: string[] = [];
    private historyIndex: number = -1;
    private webglContext: WebGLRenderingContext | null = null;
    private previewCanvas: HTMLCanvasElement | null = null;

    private commands: CommandMap = {
        help: (): string => {
            const commands = [
                ['help', 'Display available commands'],
                ['clear', 'Clear terminal screen'],
                ['projects', 'List active engagements'],
                ['writes', 'View security writeups'],
                ['social', 'Display contact information']
            ];
            
            return `[*] Available commands:\n${commands.map(([cmd, desc]) => 
                `    [+] ${cmd.padEnd(12)} - ${desc}`
            ).join('\n')}`;
        },

        clear: (): string => {
            this.commandHistory.innerHTML = '';
            return '';
        },
        
        projects: (): string => {
            const projects = [
                {name: "WebHackLabs", url: "https://github.com/whitehatmafia/webhacklabs", desc: "Web Security Testing Lab Environment"},
                {name: "PenTest Tools", url: "https://github.com/whitehatmafia/pentest-tools", desc: "Custom Security Testing Tools"},
            ];
            
            return `[*] Active Security Projects:\n${projects.map(p => 
                `    [+] ${p.name}\n       └─ ${p.desc}\n       └─ <a href="${p.url}" class="project-link" target="_blank">${p.url}</a>`
            ).join('\n\n')}`;
        },
        
        writes: (): string => {
            const articles: Article[] = [
                {
                    name: "Web Application Security",
                    url: "https://medium.com/@whitehatmafia/web-security",
                    imageUrl: "/images/article1.jpg"
                },
                {
                    name: "Penetration Testing Guide",
                    url: "https://medium.com/@whitehatmafia/pentest-guide",
                    imageUrl: "/images/article2.jpg"
                }
            ];
            
            this.initWebGL();
            
            return `[*] Security Research & Writeups:\n${articles.map(article => 
                `    [+] ${article.name}\n       └─ <a href="${article.url}" class="writeup-link" target="_blank">${article.url}</a>`
            ).join('\n\n')}`;
        },
        
        social: (): string => `[*] Contact Information:
    [+] GitHub
       └─ https://github.com/whitehatmafia
    [+] Medium
       └─ https://medium.com/@whitehatmafia`,  // Fixed missing closing quote and comma
    };

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeTerminal();
        });
    }

    private async initializeTerminal(): Promise<void> {
        // Reduce timeout for faster loading
        await new Promise(resolve => setTimeout(resolve, 50));

        const elements = {
            commandInput: document.getElementById('command-input'),
            commandHistory: document.getElementById('command-history'),
            terminalContent: document.getElementById('terminal-content'),
            loadingScreen: document.getElementById('loading-screen'),
            terminal: document.getElementById('terminal')
        };

        if (!Object.values(elements).every(el => el)) {
            console.error('Required DOM elements not found. Retrying...');
            setTimeout(() => this.initializeTerminal(), 100);
            return;
        }

        this.commandInput = elements.commandInput as HTMLInputElement;
        this.commandHistory = elements.commandHistory as HTMLElement;
        this.terminalContent = elements.terminalContent as HTMLElement;

        // Show terminal and hide loading screen
        elements.terminal?.classList.add('loaded');
        elements.loadingScreen?.classList.add('fade-out');

        // Initialize terminal
        await this.startTerminal();
        
        // Remove loading screen
        setTimeout(() => {
            if (elements.loadingScreen) {
                elements.loadingScreen.style.display = 'none';
            }
        }, 300);
    }

    private async startTerminal(): Promise<void> {
        // Initialize terminal elements
        this.terminalContent.style.visibility = 'visible';
        
        // Show initialization messages first
        await this.showInitMessage();
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Focus input
        this.commandInput.focus();
        
        // Add final initialization message
        const successElement = this.createOutputElement("[+] Terminal initialized successfully.");
        successElement.className = 'system-message success';
        this.commandHistory.appendChild(successElement);
        
        // Add ready class for cursor AFTER initialization
        setTimeout(() => {
            document.querySelector('.terminal-input-line')?.classList.add('ready');
        }, 500);
        
        // Show help message after delay
        setTimeout(() => {
            this.executeCommand('help');
        }, 1000);
    }

    private async showInitMessage(): Promise<void> {
        // Reduce delays between messages
        const initMessages = [
            { text: this.asciiArt, class: 'ascii-art', delay: 0 },
            { text: "[*] WhiteHat Mafia Security Assessment Tool v1.0.0", class: 'system-message startup-animation', delay: 100 },
            { text: "[*] Developer: WhiteHat Mafia", class: 'system-message startup-animation', delay: 100 },
            { text: "[*] Github: https://github.com/whitehatmafia", class: 'system-message startup-animation', delay: 100 },
            { text: "[!] Starting security assessment...", class: 'system-message startup-animation warning', delay: 100 },
            { text: "[+] Checking system access...", class: 'system-message startup-animation', delay: 100 },
            { text: "[+] Loading security modules...", class: 'system-message startup-animation', delay: 100 },
            { text: "[!] System ready.", class: 'system-message startup-animation success', delay: 100 }
        ];

        // Return promise that resolves when all messages are shown
        return new Promise((resolve) => {
            let delay = 0;
            initMessages.forEach((msg, index) => {
                setTimeout(() => {
                    const msgElement = this.createOutputElement(msg.text);
                    msgElement.className = msg.class;
                    if (index === 0) {
                        msgElement.style.lineHeight = '1.2';
                    }
                    this.commandHistory.appendChild(msgElement);
                    this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
                    
                    if (index === initMessages.length - 1) {
                        resolve();
                    }
                }, delay);
                delay += msg.delay;
            });
        });
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

        // Mobile-friendly focus handling
        document.addEventListener('touchstart', () => {
            this.commandInput.focus();
        }, { passive: true });

        // Prevent zoom on double tap
        let lastTap = 0;
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
            }
            lastTap = currentTime;
        });

        // Handle mobile keyboard show/hide
        window.addEventListener('resize', () => {
            if (document.activeElement?.tagName === 'INPUT') {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
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
            outputDiv.innerHTML = `<span class="prompt-text">root@kali:~# </span>${this.sanitizeHTML(content)}`;
        } else {
            const coloredContent = this.processOutputColors(content);
            outputDiv.innerHTML = coloredContent;
        }
        
        return outputDiv;
    }

    private processOutputColors(text: string): string {
        return text
            .replace(/\[(\+|\*|\-|\!)\]/g, '<span class="$1-symbol">[$1]</span>')
            .replace(/https?:\/\/\S+/g, '<span class="url"><a href="$&" target="_blank">$&</a></span>')
            .replace(/└─/g, '<span class="tree-symbol">���─</span>');
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
                if (typeof output === 'string' && output) {  // Check output type and existence
                    const outputElement = this.createOutputElement('');
                    this.commandHistory.appendChild(outputElement);
                    
                    switch(cmd) {
                        case 'projects':
                        case 'writes':
                        case 'social':  // Add social to HTML rendering
                            outputElement.innerHTML = this.processOutputColors(output);  // Process colors
                            break;
                        default:
                            outputElement.innerHTML = this.processOutputColors(output);  // Process colors
                    }
                }
            } else {
                const errorElement = this.createOutputElement('');
                this.commandHistory.appendChild(errorElement);
                errorElement.innerHTML = `<span class="minus-symbol">[!]</span> Command not found: ${cmd}`;  // Style error
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

// Initialize terminal
new Terminal();

declare global {
    interface Window {
        showArticlePreview: (event: MouseEvent, imageUrl: string) => void;
        hideArticlePreview: () => void;
    }
}

export {};
