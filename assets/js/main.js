import gsap from 'gsap';
class Terminal {
    constructor() {
        this.commandsHistory = [];
        this.historyIndex = -1;
        this.commands = {
            help: () => `Available commands:
    help       - Display this help message
    projects   - Display a list of projects
    writes     - Display a list of write-ups`,
            projects: () => `My Projects:
    1. Project One - A brief description
    2. Project Two - Another description
    3. Project Three - Yet another description`,
            writes: () => `Recent Write-ups:
    1. Article One - Technical writing
    2. Article Two - Development tips
    3. Article Three - Coding tutorials`,
            clear: () => {
                this.commandHistory.innerHTML = '';
                return '';
            }
        };
        this.commandInput = document.getElementById('command-input');
        this.commandHistory = document.getElementById('command-history');
        this.terminalContent = document.getElementById('terminal-content');
        this.initializeEventListeners();
        this.initializeAnimations();
    }
    initializeEventListeners() {
        this.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = this.commandInput.value;
                this.executeCommand(command);
                this.commandInput.value = '';
            }
        });
        this.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
        document.getElementById('terminal')?.addEventListener('click', () => {
            this.commandInput.focus();
        });
    }
    initializeAnimations() {
        gsap.from('#terminal', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
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
    createOutputElement(content, isCommand = false) {
        const outputDiv = document.createElement('div');
        outputDiv.className = isCommand ? 'input-line' : 'command-output';
        if (isCommand) {
            outputDiv.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${content}`;
        }
        else {
            outputDiv.textContent = content;
        }
        return outputDiv;
    }
    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex < this.commandsHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = this.commandsHistory[this.commandsHistory.length - 1 - this.historyIndex] || '';
        }
        else if (direction === 'down' && this.historyIndex > -1) {
            this.historyIndex--;
            this.commandInput.value = this.commandsHistory[this.commandsHistory.length - 1 - this.historyIndex] || '';
        }
    }
    addToHistory(command) {
        if (command.trim()) {
            this.commandsHistory.push(command);
            this.historyIndex = -1;
        }
    }
    executeCommand(command) {
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
            }
            else {
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
    const terminal = new Terminal();
    // Show initial help message
    setTimeout(() => {
        terminal['executeCommand']('help');
    }, 1500);
});
