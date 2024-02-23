import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Symbol from '../Symbol/Symbol';
import './GridTool.css'

const SYMBOL_SIZE = 150;

const GridTool = ({ symbols, onEditSymbol, onDeleteSymbol }) => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const [dragging, setDragging] = useState(false);
  const [draggedSymbol, setDraggedSymbol] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const symbolsArr = Object.values(symbols);
//   const [fSymbols, setFSymbols] = useState(symbols);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
        const clientWidth = canvas.clientWidth;
        const { innerHeight } = window;
        canvas.width = clientWidth
        canvas.height = innerHeight;
        drawGrid();
        drawSymbols();
    };


    const drawGrid = () => {
        const gridSize = 10;
        const { width, height } = canvas;

        ctx.fillStyle = '#DCF2FF';
        ctx.fillRect(0, 0, width, height); // rectangle covering the entire canvas

        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
            ctx.moveTo(x + 0.5, 0); /// adjustment for linewidth
            ctx.lineTo(x + 0.5, height);
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.moveTo(0, y + 0.5); // adjustment for linewidth
            ctx.lineTo(width, y + 0.5);
        }
        ctx.strokeStyle = '#8ed2ff';
        ctx.lineWidth = 0.5; // make lines appear thinner
        ctx.stroke();
    };

    const drawSymbols = () => {
        if (!symbolsArr.length) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
        }
        else {
            symbolsArr.forEach(({ id, type, x_position, y_position, text }) => {
                Symbol.draw(ctx, type, x_position, y_position, text);

                if (selectedSymbol && selectedSymbol.id === id) {
                    ctx.strokeStyle = 'yellow';
                    ctx.lineWidth = 4;

                    switch (type) {
                        case 'Terminal':
                            ctx.ellipse(x_position, y_position, SYMBOL_SIZE / 2, SYMBOL_SIZE / 4, 0, 0, Math.PI * 2);
                            ctx.stroke();
                            break;
                        case 'Decision':
                            ctx.beginPath();
                            ctx.moveTo(x_position, y_position - SYMBOL_SIZE / 3);
                            ctx.lineTo(x_position + SYMBOL_SIZE / 1.75, y_position);
                            ctx.lineTo(x_position, y_position + SYMBOL_SIZE / 3);
                            ctx.lineTo(x_position - SYMBOL_SIZE / 1.75, y_position);
                            ctx.closePath();
                            ctx.stroke();
                            break;
                        case 'Process':
                            ctx.strokeRect(x_position - SYMBOL_SIZE / 2, y_position - SYMBOL_SIZE / 4, SYMBOL_SIZE, SYMBOL_SIZE / 2);
                            break;
                        case 'Data':
                            ctx.beginPath();
                            ctx.moveTo(x_position - SYMBOL_SIZE / 2, y_position - SYMBOL_SIZE / 4);
                            ctx.lineTo(x_position + SYMBOL_SIZE / 2, y_position - SYMBOL_SIZE / 4);
                            ctx.lineTo(x_position + SYMBOL_SIZE / 1.33, y_position + SYMBOL_SIZE / 4);
                            ctx.lineTo(x_position - SYMBOL_SIZE / 4, y_position + SYMBOL_SIZE / 4);
                            ctx.closePath();
                            ctx.stroke();
                            break;
                        default:
                            break;
                    }
                }

            });
        }
    }


    const handleMouseDown = e => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const clickedSymbol = symbolsArr.find(symbol => {
            switch (symbol.type) {
                case 'Terminal':
                  return (
                    mouseX >= symbol.x_position - SYMBOL_SIZE / 2 &&
                    mouseX <= symbol.x_position + SYMBOL_SIZE / 2 &&
                    mouseY >= symbol.y_position - SYMBOL_SIZE / 4 &&
                    mouseY <= symbol.y_position + SYMBOL_SIZE / 4
                  );
                case 'Decision':
                  return (
                    mouseX >= symbol.x_position - SYMBOL_SIZE / 1.75 &&
                    mouseX <= symbol.x_position + SYMBOL_SIZE / 1.75 &&
                    mouseY >= symbol.y_position - SYMBOL_SIZE / 3 &&
                    mouseY <= symbol.y_position + SYMBOL_SIZE / 3
                  );
                case 'Process':
                  return (
                    mouseX >= symbol.x_position - SYMBOL_SIZE / 2 &&
                    mouseX <= symbol.x_position + SYMBOL_SIZE / 2 &&
                    mouseY >= symbol.y_position - SYMBOL_SIZE / 4 &&
                    mouseY <= symbol.y_position + SYMBOL_SIZE / 4
                  );
                case 'Data':
                  return (
                    mouseX >= symbol.x_position - SYMBOL_SIZE / 2 &&
                    mouseX <= symbol.x_position + SYMBOL_SIZE / 1.33 &&
                    mouseY >= symbol.y_position - SYMBOL_SIZE / 4 &&
                    mouseY <= symbol.y_position + SYMBOL_SIZE / 4
                  );
                default:
                  return false;
              }
        });


        if (clickedSymbol) {
          setDragging(true);
          setDraggedSymbol(clickedSymbol);
          setOffsetX(mouseX - clickedSymbol.x_position);
          setOffsetY(mouseY - clickedSymbol.y_position);
          setSelectedSymbol(clickedSymbol);
        } else setSelectedSymbol(null);

    };

    const handleMouseMove = e => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (dragging && draggedSymbol) {
          draggedSymbol.x_position = mouseX - offsetX;
          draggedSymbol.y_position = mouseY - offsetY;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawGrid();
          drawSymbols();
        }

        if (dragging) {
            document.body.style.cursor = 'grabbing';
          }
        else {

            const isOverSymbol = symbolsArr.some(symbol => {
                switch (symbol.type) {
                    case 'Terminal':
                    return (
                        mouseX >= symbol.x_position - SYMBOL_SIZE / 2 &&
                        mouseX <= symbol.x_position + SYMBOL_SIZE / 2 &&
                        mouseY >= symbol.y_position - SYMBOL_SIZE / 4 &&
                        mouseY <= symbol.y_position + SYMBOL_SIZE / 4
                    );
                    case 'Decision':
                    return (
                        mouseX >= symbol.x_position - SYMBOL_SIZE / 1.75 &&
                        mouseX <= symbol.x_position + SYMBOL_SIZE / 1.75 &&
                        mouseY >= symbol.y_position - SYMBOL_SIZE / 3 &&
                        mouseY <= symbol.y_position + SYMBOL_SIZE / 3
                    );
                    case 'Process':
                    return (
                        mouseX >= symbol.x_position - SYMBOL_SIZE / 2 &&
                        mouseX <= symbol.x_position + SYMBOL_SIZE / 2 &&
                        mouseY >= symbol.y_position - SYMBOL_SIZE / 4 &&
                        mouseY <= symbol.y_position + SYMBOL_SIZE / 4
                    );
                    case 'Data':
                    return (
                        mouseX >= symbol.x_position - SYMBOL_SIZE / 2 &&
                        mouseX <= symbol.x_position + SYMBOL_SIZE / 1.33 &&
                        mouseY >= symbol.y_position - SYMBOL_SIZE / 4 &&
                        mouseY <= symbol.y_position + SYMBOL_SIZE / 4
                    );
                    default:
                      return false;
                  }
            });

            document.body.style.cursor = isOverSymbol ? 'grab' : 'auto';
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setDraggedSymbol(null);

        if (draggedSymbol) {
            const payload = {
                x_position: draggedSymbol.x_position,
                y_position: draggedSymbol.y_position,
                text: draggedSymbol.text,
                type: draggedSymbol.type
            }
            onEditSymbol(payload, draggedSymbol.id);
        }
    };

    const handleKeyDown = e => {
        // check if the delete key is pressed
        console.log('deleted')
        if (
            e.key === 'Delete' ||
            e.key === 'Backspace' ||
            e.key === 'Del' ||
            e.key === 'Forward Delete'
        ) {
            // console.log('deleted')
            onDeleteSymbol(selectedSymbol.id);
        }
    };

    canvas.addEventListener('keydown', handleKeyDown);

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    resizeCanvas(); // call resizeCanvas initially
    window.addEventListener('resize', resizeCanvas); // add event listener for window resize

    // cleanup function
    return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, symbols, dragging, draggedSymbol, selectedSymbol]);

  // tabindex so deletion via keydown is contained within canvas
  return <canvas id="grid-tool" ref={canvasRef} tabIndex="0"/>;
};

export default GridTool;
