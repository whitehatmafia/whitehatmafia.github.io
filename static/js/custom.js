document.addEventListener('DOMContentLoaded', function() {
  console.log('Custom JS loaded');

  // GSAP animations
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.menu-item', {
    duration: 1,
    opacity: 0,
    y: 20,
    stagger: 0.2
  });

  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.project-card',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2
  });

  // Terminal-like text animation
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // GitHub projects fetching
  async function fetchGitHubProjects() {
    const username = 'whitehatmafia'; // Replace with your GitHub username
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const projects = await response.json();
    
    const projectsContainer = document.getElementById('github-projects');
    projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.classList.add('project-card');
      projectElement.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'No description available'}</p>
        <a href="${project.html_url}" target="_blank">View on GitHub</a>
      `;
      projectsContainer.appendChild(projectElement);
    });

    // Animate new project cards
    gsap.from('.project-card', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2
    });
  }

  // Mobile menu toggle
  function toggleMobileMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');
}

// Zombie easter egg
function zombieEasterEgg() {
  const zombieEmoji = '🧟';
  const body = document.body;
  
  body.addEventListener('click', (e) => {
    const zombie = document.createElement('div');
    zombie.textContent = zombieEmoji;
    zombie.style.position = 'absolute';
    zombie.style.left = `${e.clientX}px`;
    zombie.style.top = `${e.clientY}px`;
    zombie.style.fontSize = '2rem';
    zombie.style.transition = 'all 0.5s ease-out';
    
    body.appendChild(zombie);
    
    setTimeout(() => {
      zombie.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
      zombie.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
      body.removeChild(zombie);
    }, 550);
  });
}

// Call functions
fetchGitHubProjects();
zombieEasterEgg();

// Add event listener for mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', toggleMobileMenu);
}

