import { fabric } from 'fabric';
import Arrow from '../Arrow';
import ConnectionPoint from '../ConnectionPoint';
const SYMBOL_SIZE = 150;

const Symbol = {
  draw: function(canvas, id, type, x, y, text, onEditSymbol, onCreateArrow) {
    let shape;
    let textObj;
    let points;
    let connections = [];
    let pointOffset = 4;
    const positions = ['mt', 'mr', 'mb', 'ml'];
      switch (type) {
        case 'Terminal': {
          shape = new fabric.Ellipse({
              left: x,
              top: y,
              rx: SYMBOL_SIZE / 2,
              ry: SYMBOL_SIZE / 4,
              fill: '#E2937B',
              originX: 'center',
              originY: 'center',
              stroke: '#d46442',
              strokeWidth: 3,
          });
          textObj = new fabric.Textbox(text, {
            left: x,
            top: y,
            originX: 'center',
            originY: 'center',
            fill: 'black',
            fontSize: 12,
            fontFamily: 'Arial',
            textAlign: 'center',
            textBaseline: 'middle',
            editable: true, // Enable editing
          });

          connections = [
            new ConnectionPoint({ left: shape.left - shape.get('rx') - pointOffset, top: shape.top - pointOffset, position: 'ml' }),
            new ConnectionPoint({ left: shape.left + shape.get('rx') - pointOffset, top: shape.top - pointOffset, position: 'mr'}),
            new ConnectionPoint({ left: shape.left - pointOffset, top: shape.top - shape.get('ry') - pointOffset, position: 'mt' }),
            new ConnectionPoint({ left: shape.left - pointOffset, top: shape.top + shape.get('ry') - pointOffset, position: 'mb'  }),
          ];
          break;
        }
          case 'Decision': {
              // Draw diamond using Fabric.js methods
              shape = new fabric.Polygon([
                  { x: x + SYMBOL_SIZE / 1.75, y },
                  { x: x + SYMBOL_SIZE / 0.875, y: y + SYMBOL_SIZE / 3 },
                  { x: x + SYMBOL_SIZE / 1.75, y: y + SYMBOL_SIZE / 1.5 },
                  { x, y: y + SYMBOL_SIZE / 3 },
              ], {
                  fill: '#E6B85F',
                  stroke: '#e3a01e',
                  strokeWidth: 3,
              });
              textObj = new fabric.Textbox(text, {
                left: x + SYMBOL_SIZE / 1.75,
                top: y + SYMBOL_SIZE / 3,
                originX: 'center',
                originY: 'center',
                fill: 'black',
                fontSize: 12,
                fontFamily: 'Arial',
                textAlign: 'center',
                textBaseline: 'middle',
                editable: true, // Enable editing
              });
              for (let i = 0; i < shape.points.length; i++) {
                const point = shape.points[i];
                connections.push(new ConnectionPoint({ left: point.x - pointOffset, top: point.y - pointOffset, position: positions[i]}));
              }
            break;
          }
          case 'Process': {
              // Draw rectangle using Fabric.js methods
              shape = new fabric.Rect({
                  left: x,
                  top: y,
                  width: SYMBOL_SIZE,
                  height: SYMBOL_SIZE / 2,
                  fill: '#61C16A',
                  stroke: '#2aa336',
                  strokeWidth: 3,
              });
              textObj = new fabric.Textbox(text, {
                left: x + SYMBOL_SIZE / 2,
                top: y + SYMBOL_SIZE / 4,
                originX: 'center',
                originY: 'center',
                fill: 'black',
                fontSize: 12,
                fontFamily: 'Arial',
                textAlign: 'center',
                textBaseline: 'middle',
                editable: true, // Enable editing
              });

              connections = [
                new ConnectionPoint({ left: (shape.left + (shape.width / 2)) - pointOffset, top: shape.top - pointOffset, position: 'mt' }),
                new ConnectionPoint({ left: shape.left - pointOffset, top: shape.top + (shape.height / 2) - pointOffset, position: 'ml' }),
                new ConnectionPoint({ left: shape.left + shape.width - pointOffset, top: shape.top + (shape.height / 2) - pointOffset, position: 'mr'  }),
                new ConnectionPoint({ left: (shape.left + (shape.width / 2)) - pointOffset, top: shape.top + shape.height - pointOffset, position: 'mb'  }),
              ];
            break;
          }
          case 'Data': {
              // Draw polygon using Fabric.js methods
              points = [
                  { x, y },
                  { x: x + SYMBOL_SIZE, y},
                  { x: x + SYMBOL_SIZE * 1.25, y: y + SYMBOL_SIZE / 2},
                  { x: x + SYMBOL_SIZE / 4, y: y + SYMBOL_SIZE / 2 }
              ];
              shape = new fabric.Polygon(points, {
                  fill: '#7CABE2',
                  stroke: '#438ade',
                  strokeWidth: 3,
              });
              textObj = new fabric.Textbox(text, {
                left: x + SYMBOL_SIZE / 1.625,
                top: y + SYMBOL_SIZE / 4,
                originX: 'center',
                originY: 'center',
                fill: 'black',
                fontSize: 12,
                fontFamily: 'Arial',
                textAlign: 'center',
                textBaseline: 'middle',
                editable: true, // Enable editing
              });

              connections = [
                new ConnectionPoint({ left: (shape.left + (shape.width / 2)), top: shape.top - pointOffset, position: 'mt' }),
                new ConnectionPoint({ left: shape.left + (shape.width / 10) - pointOffset, top: shape.top + (shape.height / 2) - pointOffset, position: 'ml' }),
                new ConnectionPoint({ left: shape.left + (shape.width / 1.11) - pointOffset, top: shape.top + (shape.height / 2) - pointOffset, position: 'mr' }),
                new ConnectionPoint({ left: (shape.left + (shape.width / 2)), top: shape.top + shape.height - pointOffset, position: 'mb'  }),
              ];
            break;
          }
          default:
              break;
      }

      textObj.width = SYMBOL_SIZE;

      const hoverCircles = [];

      connections.forEach(connection => {
        const hoverCircle = new fabric.Circle({radius: 10, fill: 'red', opacity: 0});
        hoverCircle.set({
          left: connection.left - 7,
          top: connection.top - 7,
        });
        connection.hoverCircle = hoverCircle;
        hoverCircles.push(hoverCircle);
      });



      const group = new fabric.Group([shape, textObj, ...hoverCircles, ...connections], {
        left: shape.left,
        top: shape.top,
        originX: 'center',
        originY: 'center',
        id,
        symbolType: type,
        size: SYMBOL_SIZE,
        hasControls: false,
        subTargetCheck: true,
        // perPixelTargetFind: true,
        currentConnection: null
      });


      group.on('mousedblclick', () => {
        // textForEditing is temporary obj,
        // and will be removed after editing
        let textForEditing = new fabric.Textbox(textObj.text, {
          originX: 'center',
          originY: 'center',
          textAlign: textObj.textAlign,
          fontSize: textObj.fontSize,
          fontFamily: textObj.fontFamily,
          left: group.left,
          top: group.top,
          width: textObj.width
        })

        // hide group inside text
        textObj.visible = false;
        // note important, text cannot be hidden without this
        group.addWithUpdate();

        textForEditing.visible = true;
        // do not give controls, do not allow move/resize/rotation on this
        textForEditing.hasConstrols = false;


        // now add this temporary obj to canvas
        canvas.add(textForEditing);
        canvas.setActiveObject(textForEditing);
        // make the cursor showing
        textForEditing.enterEditing();
        textForEditing.selectAll();


        // editing:exited means you click outside of the textForEditing
        textForEditing.on('editing:exited', () =>{
            let newVal = textForEditing.text;
            let oldVal = text.text;
            // console.log(textObj.text)

          // then we check if text is changed
          if (newVal !== oldVal) {
            textObj.set({
                text: newVal,
                visible: true,
            })

            // comment before, you must call this
            group.addWithUpdate();

            // we do not need textForEditing anymore
            textForEditing.visible = false;
            canvas.remove(textForEditing);

            // optional, buf for better user experience
            canvas.setActiveObject(group);
            onEditSymbol({
                x_position: x,
                y_position: y,
                text: textObj.text,
                type: group.symbolType
            }, group.id);
          }
        })
      })

      group.on('mouseover', () => {
        for (let i = 0; i < connections.length; i++) {
          connections[i].show();
          // connections[i].setupEvents();
          canvas.renderAll();
        }

        canvas.on('mouse:move',onMouseMove)
      });

      group.on('mouseout', () => {
        for (let i = 0; i < connections.length; i++) {
          connections[i].hide();
          canvas.renderAll();
        }

        onMouseMove();
        canvas.off('mouse:move',onMouseMove)
      });


      const onMouseMove = e => {
        if(e && e.subTargets[0] && (e.subTargets[0].objectType == 'connection')){
          e.subTargets[0].handleMouseOver();
          e.target.currentConnection = e.subTargets[0];
          // console.log(e.target.currentConnection)
          // console.log('starting', startingPoint)
          group.selectable = false;
          // console.log(e.target.currentConnection)

        }
        else if (group.currentConnection) {
          group.selectable = true;
          // console.log(group.selectable)
          group.currentConnection.handleMouseOut();
          group.currentConnection = null;
        }
        // group.dirty = true;
        canvas.requestRenderAll();
       }

       group.on('mousedown', () => {
        if (group.currentConnection) {
          // console.log('mouse down');
          const fromSymbolConnection = group.currentConnection;
          const startingPoint = group.currentConnection.handleMouseDown(group);
          // console.log(canvas._objects)
          // canvas.on('mouse:down', onMouseMove);
          let line;
          const onArrowStart = (moveEvent)  => {
            if (line) {
                canvas.remove(line);
            }

            line = new Arrow([startingPoint.x, startingPoint.y, moveEvent.pointer.x, moveEvent.pointer.y], {
                stroke: 'black',
                strokeWidth: 2,
                hasControls: false,
                selectable: true,
                lockMovementX: true,
                lockMovementY: true,
            });
            canvas.add(line);
            canvas.sendToBack(line);
            // console.log(canvas.getObjects());
        }

        canvas.on('mouse:move', onArrowStart);

        canvas.on('mouse:up', function onArrowFinish(e) {

            canvas.off('mouse:move', onArrowStart);
            canvas.off('mouse:up', onArrowFinish);

            // check if the mouse is released over another connection
            const target = e.target;
            // console.log(target);
            if (e && e.subTargets[0] && e.subTargets[0].objectType == 'connection') {
                //mouse is released over a connection, keep the line
                // console.log('Mouse up over connection');
                // const fromSymbolConnection = {...group.currentConnection};
                const toSymbolConnection = e.subTargets[0];
                const endPoint = toSymbolConnection.handleMouseDown(target);
                //remove line if connected to itself
                if (e.target !== group) {
                  line.set({ x2: endPoint.x, y2: endPoint.y });
                  canvas.bringToFront(line); // to be selected | cannot be selected if in back
                  fromSymbolConnection.fromConnected = true;
                  toSymbolConnection.toConnected = true;
                  // console.log(fromSymbolConnection);
                  // console.log(toSymbolConnection);
                  fromSymbolConnection.line = line;
                  toSymbolConnection.line = line;
                  const createdArrow = {
                    symbol_from_id: group.id,
                    symbol_to_id: target.id,
                    from_connector: fromSymbolConnection.position,
                    to_connector: toSymbolConnection.position
                  }
                  // console.log(createdArrow)

                  onCreateArrow(createdArrow);
                }
                else canvas.remove(line);

            } else {
                //mouse is released elsewhere, remove the line
                // console.log('Mouse up outside connection');
                canvas.remove(line);
            }
        });
        }
      });

      // group.on('mouseup', () => {
      //   // group.selectable = false;
      //   // group.hasControls = false;
      //   if (group.currentConnection) {
      //     console.log('mouse up')
      //     console.log('finish dragging');
      //     // canvas.off('mouse:down',onMouseMove)
      //   }
      // });



      // group.addWithUpdate();
      canvas.add(group);
      return group;
    },


};

export default Symbol;
