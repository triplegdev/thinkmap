import { useRef, useEffect } from 'react';
import './Grid.css'

const Grid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

    // Function to resize canvas to match window size
    const resizeCanvas = () => {
        const { innerWidth, innerHeight } = window;
        canvas.width = innerWidth // Set canvas width to match container width
        canvas.height = innerHeight; // Set canvas height to match container height
        drawGrid();
    };

    // Function to draw the grid
    const drawGrid = () => {
        const gridSize = 10; // Adjust this value to change grid size
        const { width, height } = canvas;

        ctx.fillStyle = '#DCF2FF'; // Set background color
        ctx.fillRect(0, 0, width, height); // Fill rectangle covering the entire canvas

        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
            ctx.moveTo(x + 0.5, 0); // Add 0.5 to x to make lines appear thinner
            ctx.lineTo(x + 0.5, height);
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.moveTo(0, y + 0.5); // Add 0.5 to y to make lines appear thinner
            ctx.lineTo(width, y + 0.5);
        }
        ctx.strokeStyle = '#8ed2ff';
        ctx.lineWidth = 0.5; // Set the line width to make lines appear thinner
        ctx.stroke();
    };

    resizeCanvas(); // Call resizeCanvas initially
    window.addEventListener('resize', resizeCanvas); // Add event listener for window resize

    // Cleanup function
    return () => {
        window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return  <canvas id="grid" ref={canvasRef} />;
};

export default Grid;
