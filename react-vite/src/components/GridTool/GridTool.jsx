import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import Symbol from '../Symbol/Symbol';
import './GridTool.css'


const GridTool = ({ symbols, onEditSymbol, onDeleteSymbol }) => {
  const canvasRef = useRef(null);
  const symbolsArr = Object.values(symbols);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);
        canvas.selection = false;


    const resizeCanvas = () => {

        // clear existing objects before redrawing
        canvas.clear();
        canvas.setWidth(window.innerWidth);
        canvas.setHeight(window.innerHeight);
        // // redraw the grid and symbols
        drawGrid();
        drawSymbols();
    };


    const drawGrid = () => {
        canvas.setBackgroundColor('#DCF2FF');
        const gridSize = 10;

        const width = canvas.getWidth();
        const height = canvas.getHeight();

        const lines = [];

        // Horizontal lines
        for (let i = 0; i <= Math.ceil(height / gridSize); i++) {
        const y = i * gridSize;
        lines.push(new fabric.Line([0, y, width, y], {
            stroke: '#8ed2ff',
            strokeWidth: 0.5,
            selectable: false,
            hasControls: false
        }));
        }

        // Vertical lines
        for (let i = 0; i <= Math.ceil(width / gridSize); i++) {
        const x = i * gridSize;
        lines.push(new fabric.Line([x, 0, x, height], {
            stroke: '#8ed2ff',
            strokeWidth: 0.5,
            selectable: false,
            hasControls: false
        }));
        }

        const gridGroup = new fabric.Group(lines, {
            left: 0,
            top: 0,
            selectable: false,
            hasControls: false,
            gridSize,
        });

        //snap to grid

        // canvas.on('object:moving', function(options) {
        //     const target = options.target;
        //     target.set({
        //         left: Math.round(target.left / gridSize) * gridSize,
        //         top: Math.round(target.top / gridSize) * gridSize,
        //     });
        //     canvas.renderAll();
        // });

        canvas.add(gridGroup);
        canvas.renderAll();
    }


    const drawSymbols = () => {
        symbolsArr.forEach(({ id, type, x_position, y_position, text }) => {
            Symbol.draw(canvas, id, type, x_position, y_position, text, onEditSymbol);
        });
    }


    const handleKeyDown = (e, activeObject) => {
        if (activeObject && activeObject.type !== 'textbox' && ['Delete', 'Backspace', 'Del', 'Forward Delete'].includes(e.key)) {
            e.preventDefault();

            onDeleteSymbol(activeObject.id);
        }
    }

    let keyDownEvent;

    const handleSelection = () => {
        const activeObject = canvas.getActiveObject(); // get the currently active object
        if (activeObject) {
            document.removeEventListener('keydown', keyDownEvent);
            keyDownEvent = e => handleKeyDown(e, activeObject);
            document.addEventListener('keydown', keyDownEvent);
        } else {
            document.removeEventListener('keydown', keyDownEvent);
        }
    };

    const handleMoveSymbol = () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            const { x, y } = activeObject.getCenterPoint();
            const textObj = activeObject.getObjects().find(obj => obj.type === 'textbox');
            const payload = {
                x_position: x,
                y_position: y,
                text: textObj.text,
                type: activeObject.symbolType
            }
            onEditSymbol(payload, activeObject.id);
        }
    }


    resizeCanvas(); // call resizeCanvas initially
    window.addEventListener('resize', resizeCanvas); // add event listener for window resize
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('object:modified', handleMoveSymbol);

    // // cleanup function
    return () => {
        canvas.dispose();
        window.removeEventListener('resize', resizeCanvas);
        canvas.off('selection:created', handleSelection);
        canvas.off('selection:updated', handleSelection);
        document.removeEventListener('keydown', keyDownEvent);
        canvas.off('object:modified', handleMoveSymbol);
    };
  }, [symbols]);


  // tabindex so deletion via keydown is contained within canvas
  return <canvas id="grid-tool" ref={canvasRef} tabIndex="0"/>;
};

export default GridTool;
