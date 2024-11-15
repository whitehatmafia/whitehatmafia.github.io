document.addEventListener('DOMContentLoaded', () => {
  // Your existing animations
  
  // Add matrix rain effect in background
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

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
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
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(draw, 35);
  };

  // Add glitch effect for headings
  const addGlitchEffect = () => {
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(heading => {
      heading.addEventListener('mouseover', () => {
        const originalText = heading.textContent;
        let iterations = 0;
const interval = setInterval(() => {
        heading.textContent = originalText
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return String.fromCharCode(65 + Math.floor(Math.random() * 26));
          })
          .join("");

        if (iterations >= originalText.length) {
          clearInterval(interval);
          heading.textContent = originalText;
        }
        iterations += 1/3;
      }, 30);
    });
  });
};

// Add terminal command effect for code blocks
const addTerminalEffect = () => {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    const wrapper = document.createElement('div');
    wrapper.className = 'terminal-wrapper';
    
    const toolbar = document.createElement('div');
    toolbar.className = 'terminal-toolbar';
    toolbar.innerHTML = '<span class="terminal-btn"></span><span class="terminal-btn"></span><span class="terminal-btn"></span>';
    
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(block.parentNode);
  });
};

// Add hover effect for posts
const addPostHoverEffect = () => {
  const posts = document.querySelectorAll('.post');
  posts.forEach(post => {
    post.addEventListener('mouseenter', () => {
      gsap.to(post, {
        scale: 1.02,
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
        duration: 0.3
      });
    });
post.addEventListener('mouseleave', () => {
      gsap.to(post, {
        scale: 1,
        boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)',
        duration: 0.3
      });
    });
  });
};

// Add scanning line effect
const addScanningEffect = () => {
  const scanLine = document.createElement('div');
  scanLine.className = 'scan-line';
  document.body.appendChild(scanLine);

  gsap.to(scanLine, {
    top: '100%',
    duration: 3,
    ease: 'none',
    repeat: -1,
    yoyo: true
  });
};

// Add typing effect for code snippets
const addTypingEffect = () => {
  const codeSnippets = document.querySelectorAll('code:not(pre code)');
  codeSnippets.forEach(snippet => {
    snippet.style.opacity = '0';
    gsap.to(snippet, {
      opacity: 1,
      duration: 0.5,
      delay: 0.2,
      scrollTrigger: {
        trigger: snippet,
        start: 'top bottom',
        end: 'bottom top'
      }
    });
  });
};

// Initialize all effects
const initializeEffects = () => {
  createMatrixRain();
  addGlitchEffect();
  addTerminalEffect();
  addPostHoverEffect();
  addScanningEffect();
  addTypingEffect();
};

// Run all animations and effects
initializeEffects();

// Handle window resize for matrix effect
window.addEventListener('resize', () => {
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// Add loading animation
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => loader.remove()
    });
  }
});
