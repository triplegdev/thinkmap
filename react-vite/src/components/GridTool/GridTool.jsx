// import { useState } from 'react';
import { useRef, useEffect } from 'react';
import Symbol from '../Symbol/Symbol';
import './GridTool.css'

const GridTool = ({ selectedShape, symbols }) => {
  const canvasRef = useRef(null);
//   const [fSymbols, setFSymbols] = useState(symbols);

  useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

    // Function to resize canvas to match window size
    const resizeCanvas = () => {
        const parentWidth = canvas.parentNode.clientWidth; // Get the width of the parent container
        const { innerHeight } = window;
        canvas.width = parentWidth // Set canvas width to match container width
        canvas.height = innerHeight; // Set canvas height to match container height
        drawGrid();
        if (!Object.values(symbols).length) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
        }
        else {
            Object.values(symbols).forEach(({ type, x_position, y_position, text }) => {
                Symbol.draw(ctx, type, x_position, y_position, text); // Call draw method of Symbol component
            });
        }
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
  }, [symbols]);

  return (
    <>
        <canvas id="grid-tool" ref={canvasRef} />
        {selectedShape && <div>selectedShape</div>}
    </>
  );
};

export default GridTool;
