import gsap from 'gsap';

interface CommandMap {
    [key: string]: () => string;
}

class Terminal {
    private commandInput: HTMLInputElement;
    private commandHistory: HTMLElement;
    private terminalContent: HTMLElement;
    private commandsHistory: string[] = [];
    private historyIndex: number = -1;

    private commands: CommandMap = {
        help: (): string => `Available commands:
    help     - Display this help message
    clear    - Clear terminal screen
    projects - View GitHub projects
    writes   - View Medium writeups
    social   - View social links`,
        
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
            const articles = [
                {name: "Article 1", url: "https://medium.com/@yourhandle/article1"},
                {name: "Article 2", url: "https://medium.com/@yourhandle/article2"},
                // Add your actual Medium article URLs here
            ];
            
            return articles.map(a => 
                `<a href="${a.url}" class="writeup-link" target="_blank">→ ${a.name}</a>`
            ).join('\n');
        },
        
        clear: (): string => {
            this.commandHistory.innerHTML = '';
            return '';
        },
        
        social: (): string => `Connect with me:
    GitHub: https://github.com/whitehatmafia
    Medium: https://medium.com/@yourhandle`
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
        
        if (this.terminalContent) {
            this.terminalContent.style.visibility = 'visible';
        }
        
        this.initializeEventListeners();
        // Comment out animations temporarily
        // this.initializeAnimations();
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
            outputDiv.innerHTML = `<span class="prompt">visitor@whitehat:~$</span> ${content}`;
        } else {
            outputDiv.innerHTML = content; // Changed from textContent to innerHTML to support links
        }
        
        return outputDiv;
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

     private executeCommand(command: string): void {
        const cmd = command.toLowerCase().trim();
        
        if (cmd) {
            this.addToHistory(command);
            
            // Animate command entry
            const commandElement = this.createOutputElement(command, true);
            this.commandHistory.appendChild(commandElement);
            
            gsap.from(commandElement, {
                duration: 0.3,
                opacity: 0,
                y: 10,
                ease: 'power2.out'
            });

            if (cmd in this.commands) {
                const output = this.commands[cmd]();
                if (output) {
                    const outputElement = this.createOutputElement(output);
                    this.commandHistory.appendChild(outputElement);
                    
                    gsap.from(outputElement, {
                        duration: 0.3,
                        opacity: 0,
                        y: 10,
                        delay: 0.1,
                        ease: 'power2.out'
                    });
                }
            } else {
                const errorElement = this.createOutputElement(`Command not found: ${cmd}`);
                this.commandHistory.appendChild(errorElement);
                
                gsap.from(errorElement, {
                    duration: 0.3,
                    opacity: 0,
                    y: 10,
                    delay: 0.1,
                    ease: 'power2.out'
                });
            }
            
            this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
        }
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

export {};
