document.querySelectorAll('.ripple-anim').forEach(button => {
  button.addEventListener('click', function(e) {
    // Remove previous ripples
    const ripples = this.getElementsByClassName('ripple');
    while (ripples[0]) {
      ripples[0].remove();
    }
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size/2}px`;
    ripple.style.top = `${e.clientY - rect.top - size/2}px`;
    
    this.appendChild(ripple);
  });
});