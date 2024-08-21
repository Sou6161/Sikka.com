import React, { useEffect, useRef } from 'react';

const AnimatedGridBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = 40;
    const cols = Math.ceil(window.innerWidth / gridSize);
    const rows = Math.ceil(window.innerHeight / gridSize);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const maxActiveBoxes = 12;
    let activeBoxes = [];

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }
      

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Remove faded boxes
      activeBoxes = activeBoxes.filter(box => box.life > 0);

      // Add new boxes if needed
      while (activeBoxes.length < maxActiveBoxes) {
        activeBoxes.push({
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
          life: 1,
          fadingIn: true
        });
      }

      // Draw and update boxes
      activeBoxes.forEach(box => {
        let opacity;
        if (box.fadingIn) {
          opacity = easeInOutCubic(1 - box.life);
          if (opacity >= 0.95) {
            box.fadingIn = false;
          }
        } else {
          opacity = easeOutCubic(box.life); // Use easeOutCubic for fade-out
        }
        ctx.fillStyle = `rgba(243, 243, 243, ${opacity})`; // gray-600 with opacity
        ctx.fillRect(box.x * gridSize, box.y * gridSize, gridSize - 1, gridSize - 1);
        
        box.life -= 0.002; // Adjust for faster or slower transition
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas  ref={canvasRef} className="fixed inset-0 -z-10 bg-white" />
  );
};

export default AnimatedGridBackground;