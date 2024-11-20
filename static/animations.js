// static/js/animations.js
gsap.registerPlugin(ScrollTrigger);

// Terminal typing effect
function typeEffect(element, text, speed = 50) {
    let index = 0;
    
    const timer = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Terminal startup animation
gsap.from('#terminal', {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: 'power2.out'
});