import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import Symbol from '../Symbol/Symbol';
import Arrow from '../Arrow';
import './GridTool.css'


const GridTool = ({ arrows, symbols, onEditSymbol, onDeleteSymbol, onCreateArrow, onDeleteArrow }) => {
  const canvasRef = useRef(null);
  const symbolsArr = Object.values(symbols);
  const arrowsArr = Object.values(arrows);

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
        // drawArrows();
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
        const symbolGroups = [];
        symbolsArr.forEach(({ id, type, x_position, y_position, text }) => {
            const symbolGroup = Symbol.draw(canvas, id, type, x_position, y_position, text, onEditSymbol, onCreateArrow);
            symbolGroups.push(symbolGroup);
        });
        drawArrows(symbolGroups);
    }

    const drawArrows = (symbolGroups) => {
        arrowsArr.forEach(({id, symbol_from_id, symbol_to_id, from_connector, to_connector}) => {
            const fromSymbolGroup = symbolGroups.find(symbolGroup => symbolGroup.id === symbol_from_id);
            const toSymbolGroup = symbolGroups.find(symbolGroup => symbolGroup.id === symbol_to_id);
            // console.log(fromSymbolGroup)
            let fromConnection;
            let toConnection;
            if (fromSymbolGroup && toSymbolGroup) {
                fromSymbolGroup.forEachObject((obj) => {
                    if (obj.objectType === 'connection' && obj.position && obj.position === from_connector) {
                        // console.log('from', obj)
                        fromConnection = obj;
                        fromConnection.fromConnected = true;
                        // obj.handleMouseDown(symbolGroup);
                    }
                });
                toSymbolGroup.forEachObject((obj) => {
                    if (obj.objectType === 'connection' && obj.position && obj.position === to_connector) {
                        // console.log('to', obj)
                        toConnection = obj;
                        toConnection.toConnected = true;
                        // obj.handleMouseDown(symbolGroup);
                    }
                });
                const startingPoint = fromConnection.handleMouseDown(fromSymbolGroup);
                const endPoint = toConnection.handleMouseDown(toSymbolGroup);

                const arrow = new Arrow([startingPoint.x, startingPoint.y, endPoint.x, endPoint.y], {
                    stroke: 'black',
                    strokeWidth: 2,
                    hasControls: false,
                    selectable: true,
                    lockMovementX: true,
                    lockMovementY: true,
                    id
                });
                fromConnection.line = arrow;
                toConnection.line = arrow;
                canvas.add(arrow);
                // console.log('start', startingPoint, 'end', endPoint);
            }

        });
    }


    const handleKeyDown = (e, activeObject) => {
        if (activeObject && activeObject.type !== 'textbox' && ['Delete', 'Backspace', 'Del', 'Forward Delete'].includes(e.key)) {
            e.preventDefault();
            if(activeObject.type === 'arrow') {
                onDeleteArrow(activeObject.id)
            }
            else {
                onDeleteSymbol(activeObject.id);
            }
        }
    }

    let keyDownEvent;

    const handleSelection = () => {
        // console.log(canvas.getActiveObject())
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
        // console.log('active', activeObject);
        if (activeObject) {
            const { x, y } = activeObject.getCenterPoint();
            const textObj = activeObject.getObjects().find(obj => obj.type === 'textbox');
            const payload = {
                x_position: Math.round(x),
                y_position: Math.round(y),
                text: textObj.text,
                type: activeObject.symbolType
            }
            onEditSymbol(payload, activeObject.id);
        }
    }

    const handleMovingSymbol = () => {
        const activeObject = canvas.getActiveObject();
        // console.log('active', activeObject);
        const connections = [];
        activeObject.forEachObject(obj => {
            if (obj.toConnected || obj.fromConnected) connections.push(obj);
        });
        if (connections.length) {
            // const position = connection.handleMouseDown(activeObject);
            // console.log(position);
            connections.forEach(connection => {
                if (connection.fromConnected) {
                    connection.line.set({
                        x1: activeObject.left + connection.left + 4, // added points to center
                        y1: activeObject.top + connection.top + 4
                    });
                }
                else if (connection.toConnected) {
                    connection.line.set({
                        x2: activeObject.left + connection.left + 4,
                        y2: activeObject.top + connection.top + 4
                    });
                }
            });
            canvas.renderAll();
        }
    }


    resizeCanvas(); // call resizeCanvas initially
    window.addEventListener('resize', resizeCanvas); // add event listener for window resize
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('object:modified', handleMoveSymbol);
    canvas.on('object:moving', handleMovingSymbol);

    // // cleanup function
    return () => {
        canvas.dispose();
        window.removeEventListener('resize', resizeCanvas);
        canvas.off('selection:created', handleSelection);
        canvas.off('selection:updated', handleSelection);
        document.removeEventListener('keydown', keyDownEvent);
        canvas.off('object:modified', handleMoveSymbol);
        canvas.off('object:moving', handleMovingSymbol);
    };
  }, [symbols, arrows]);


  // tabindex so deletion via keydown is contained within canvas
  return <canvas id="grid-tool" ref={canvasRef} tabIndex="0"/>;
};

export default GridTool;
