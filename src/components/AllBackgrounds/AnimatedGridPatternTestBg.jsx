// import React, { useEffect, useRef, useState } from "react";

// const AnimatedGridBackground = () => {
//   const canvasRef = useRef(null);
//   const [contentHeight, setContentHeight] = useState(0);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const gridSize = 20;
//     let cols, rows;

//     const maxActiveBoxes = 10;
//     let activeBoxes = [];

//     function updateCanvasSize() {
//       canvas.width = window.innerWidth;
//       canvas.height = Math.max(window.innerHeight, contentHeight);
//       cols = Math.ceil(canvas.width / gridSize);
//       rows = Math.ceil(canvas.height / gridSize);
//     }

//     function easeInOutCubic(t) {
//       return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
//     }

//     function easeOutCubic(t) {
//       return 1 - Math.pow(1 - t, 3);
//     }

//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Remove faded boxes
//       activeBoxes = activeBoxes.filter((box) => box.life > 0);

//       // Add new boxes if needed
//       while (activeBoxes.length < maxActiveBoxes) {
//         activeBoxes.push({
//           x: Math.floor(Math.random() * cols),
//           y: Math.floor(Math.random() * rows),
//           life: 1,
//           fadingIn: true,
//         });
//       }

//       // Draw and update boxes
//       activeBoxes.forEach((box) => {
//         let opacity;
//         if (box.fadingIn) {
//           opacity = easeInOutCubic(1 - box.life);
//           if (opacity >= 0.95) {
//             box.fadingIn = false;
//           }
//         } else {
//           opacity = easeOutCubic(box.life);
//         }
//         ctx.fillStyle = `rgba(243, 243, 243, ${opacity})`;
//         ctx.filter = "blur(2px)";
//         ctx.beginPath();
//         ctx.arc(
//           box.x * gridSize + gridSize / 2,
//           box.y * gridSize + gridSize / 2,
//           gridSize / 2,
//           0,
//           2 * Math.PI
//         );
//         ctx.fill();
//         ctx.filter = "none";

//         box.life -= 0.002;
//       });

//       requestAnimationFrame(animate);
//     }

//     updateCanvasSize();
//     animate();

//     const handleResize = () => {
//       updateCanvasSize();
//     };

//     window.addEventListener("resize", handleResize);

//     // Observer to track content height changes
//     const resizeObserver = new ResizeObserver(entries => {
//       for (let entry of entries) {
//         if (entry.target === document.body) {
//           setContentHeight(entry.target.scrollHeight);
//         }
//       }
//     });

//     resizeObserver.observe(document.body);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       resizeObserver.disconnect();
//     };
//   }, [contentHeight]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 -z-10 w-full"
//       style={{
//         background: "linear-gradient(#212121, #3B3F54)",
//         backgroundSize: "100% 100%",
//         backgroundRepeat: "repeat-y",
//       }}
//     />
//   );
// };

// export default AnimatedGridBackground;


import React from 'react'

const AnimatedGridPatternBg = () => {
  return (
    <div className=' w-[100vw] h-[1245vh]  large:h-[1441vh] bg-black'>AnimatedGridPatternBg</div>
  )
}

export default AnimatedGridPatternBg