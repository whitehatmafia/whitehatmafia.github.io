import gsap from 'gsap';
class TerminalPortfolio {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.terminalOutput = document.getElementById('terminal-output');
        this.terminalInput = document.getElementById('terminal-input');
        this.commands = new Map();
        this.initializeCommands();
        this.setupEventListeners();
        this.animateIntro();
    }
    initializeCommands() {
        this.commands.set('help', {
            name: 'help',
            description: 'Show available commands',
            action: () => this.showHelp()
        });
        this.commands.set('about', {
            name: 'about',
            description: 'Learn about me',
            action: () => this.showAbout()
        });
        this.commands.set('projects', {
            name: 'projects',
            description: 'View my projects',
            action: () => this.showProjects()
        });
        this.commands.set('contact', {
            name: 'contact',
            description: 'Get my contact information',
            action: () => this.showContact()
        });
        this.commands.set('clear', {
            name: 'clear',
            description: 'Clear the terminal',
            action: () => this.clearTerminal()
        });
        this.commands.set('skills', {
            name: 'skills',
            description: 'View my technical skills',
            action: () => this.showSkills()
        });
        this.commands.set('experience', {
            name: 'experience',
            description: 'View my work experience',
            action: () => this.showExperience()
        });
        this.commands.set('education', {
            name: 'education',
            description: 'View my educational background',
            action: () => this.showEducation()
        });
    }
    showSkills() {
        const skillsText = `Technical Skills:
            ├── Languages: TypeScript, JavaScript, Python, Go
        ├── Frontend: React, Vue, HTML5, CSS3, Tailwind
        ├── Backend: Node.js, Express, Django
        └── Tools: Git, Docker, AWS
        `;
        this.printOutput(skillsText);
    }
    showExperience() {
        const experienceText = `Work Experience:
            ├── [Current Company] (2023-Present)
        │   └── Senior Developer
        │
        └── [Previous Company] (2020-2023)
        └── Full Stack Developer
        `;
        this.printOutput(experienceText);
    }
    showEducation() {
        const educationText = `Education:
            └── Computer Science Degree
        └── University Name (2016-2020)
        `;
        this.printOutput(educationText);
    }
    setupEventListeners() {
        this.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand();
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            }
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
    }
    animateIntro() {
        const welcomeText = `Welcome to my terminal portfolio! Type 'help' to see available commands.`;
        let chars = welcomeText.split('');
        gsap.from(this.terminalOutput, {
            opacity: 0,
            duration: 1
        });
        chars.forEach((char, index) => {
            gsap.to(this.terminalOutput, {
                delay: index * 0.05,
                onComplete: () => {
                    this.terminalOutput.innerHTML += char;
                }
            });
        });
    }
    handleCommand() {
        const input = this.terminalInput.value.trim().toLowerCase();
        if (input) {
            this.commandHistory.push(input);
            this.historyIndex = this.commandHistory.length;
            this.printCommand(input);
            const command = this.commands.get(input);
            if (command) {
                command.action();
            }
            else {
                this.printOutput(`Command not found: ${input}. Type 'help' for available commands.`);
            }
        }
        this.terminalInput.value = '';
    }
    navigateHistory(direction) {
        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.terminalInput.value = this.commandHistory[this.historyIndex];
            }
        }
        else {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.terminalInput.value = this.commandHistory[this.historyIndex];
            }
            else {
                this.historyIndex = this.commandHistory.length;
                this.terminalInput.value = '';
            }
        }
    }
    printCommand(command) {
        const commandDiv = document.createElement('div');
        commandDiv.innerHTML = `<span class="text-green-300">$ </span>${command}`;
        this.terminalOutput.appendChild(commandDiv);
    }
    printOutput(output) {
        const outputDiv = document.createElement('div');
        outputDiv.innerHTML = output;
        outputDiv.classList.add('command-output');
        this.terminalOutput.appendChild(outputDiv);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
        const chars = output.split('');
        let displayText = '';
        gsap.to({}, {
            duration: 0.02 * chars.length, // Total duration based on text length
            ease: "none",
            onUpdate: () => {
                const progress = Math.floor(gsap.getProperty({}, "progress") * chars.length);
                displayText = chars.slice(0, progress).join('');
                outputDiv.textContent = displayText;
            },
            onComplete: () => {
                outputDiv.textContent = output; // Ensure full text is displayed
                this.scrollToBottom();
            }
        });
    }
    scrollToBottom() {
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }
    showHelp() {
        let helpText = 'Available commands:\n\n';
        this.commands.forEach(command => {
            helpText += `${command.name} - ${command.description}\n`;
        });
        this.printOutput(helpText);
    }
    showAbout() {
        const aboutText = `
            About Me:
            🛡️ Cybersecurity enthusiast who loves breaking (and fixing) things
            Skills: TypeScript, JavaScript
        `;
        this.printOutput(aboutText);
    }
    showProjects() {
        const projectsText = `
            My Projects:
            1. Terminal Portfolio - A terminal-style portfolio website
        
        `;
        this.printOutput(projectsText);
    }
    showContact() {
        const contactText = `
            Contact Information:
            Email: saulemus@protonmail.com
            GitHub: github.com/whitehatmafia
            LinkedIn: linkedin.com/in/whitehatmafia
        `;
        this.printOutput(contactText);
    }
    clearTerminal() {
        this.terminalOutput.innerHTML = '';
        this.animateIntro();
    }
}
// Initialize the terminal when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
});
//# sourceMappingURL=main.js.map