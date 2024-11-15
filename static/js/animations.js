document.addEventListener('DOMContentLoaded', () => {
  // Animate terminal prompt
  gsap.from('.terminal-prompt', {
    duration: 0.5,
    opacity: 0,
    x: -20,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Animate menu items
  gsap.from('.menu-item', {
    duration: 0.5,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    delay: 0.5,
    ease: 'power2.out'
  });

  // Animate content
  gsap.from('.post-content', {
    duration: 0.8,
    opacity: 0,
    y: 30,
    delay: 0.8,
    ease: 'power2.out'
  });

  // Terminal typing effect
  const terminalText = document.querySelector('.terminal-text');
  if (terminalText) {
    const text = terminalText.textContent;
    terminalText.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < text.length) {
        terminalText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }
    
    typeWriter();
  }

  // Cursor blink effect
  gsap.to('.cursor', {
    opacity: 0,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  });

  // Hover effects for links
  document.querySelectorAll('.menu-item a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
});
