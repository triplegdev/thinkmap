import { fabric } from 'fabric';
import ConnectionPoint from '../ConnectionPoint/ConnectionPoint';
const SYMBOL_SIZE = 150;

const Symbol = {
  draw: function(canvas, id, type, x, y, text, onEditSymbol) { // Accept canvas as the first argument
    let shape;
    let textObj;
    let points;
    let connections = [];
    let pointOffset = 2.5;
      switch (type) {
        case 'Terminal':
          shape = new fabric.Ellipse({
              left: x,
              top: y,
              rx: SYMBOL_SIZE / 2,
              ry: SYMBOL_SIZE / 4,
              fill: '#E2937B',
              originX: 'center',
              originY: 'center',
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
            new ConnectionPoint({ left: shape.left - shape.get('rx') - pointOffset, top: shape.top - pointOffset }),
            new ConnectionPoint({ left: shape.left + shape.get('rx') - pointOffset, top: shape.top - pointOffset }),
            new ConnectionPoint({ left: shape.left - pointOffset, top: shape.top - shape.get('ry') - pointOffset  }),
            new ConnectionPoint({ left: shape.left - pointOffset, top: shape.top + shape.get('ry') - pointOffset  }),
          ];
          break;
          case 'Decision':
              // Draw diamond using Fabric.js methods
              shape = new fabric.Polygon([
                  { x: x + SYMBOL_SIZE / 1.75, y },
                  { x: x + SYMBOL_SIZE / 0.875, y: y + SYMBOL_SIZE / 3 },
                  { x: x + SYMBOL_SIZE / 1.75, y: y + SYMBOL_SIZE / 1.5 },
                  { x, y: y + SYMBOL_SIZE / 3 },
              ], {
                  fill: '#E6B85F',
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
                connections.push(new ConnectionPoint({ left: point.x - pointOffset, top: point.y - pointOffset}));
              }
            break;
          case 'Process':
              // Draw rectangle using Fabric.js methods
              shape = new fabric.Rect({
                  left: x,
                  top: y,
                  width: SYMBOL_SIZE,
                  height: SYMBOL_SIZE / 2,
                  fill: '#61C16A',
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
                new ConnectionPoint({ left: (shape.left + (shape.width / 2)) - pointOffset, top: shape.top - pointOffset }),
                new ConnectionPoint({ left: shape.left - pointOffset, top: shape.top + (shape.height / 2) - pointOffset }),
                new ConnectionPoint({ left: shape.left + shape.width - pointOffset, top: shape.top + (shape.height / 2) - pointOffset  }),
                new ConnectionPoint({ left: shape.left + (shape.width / 2) - pointOffset, top: shape.top + shape.height - pointOffset  }),
              ];
            break;
          case 'Data':
              // Draw polygon using Fabric.js methods
              points = [
                  { x, y },
                  { x: x + SYMBOL_SIZE, y},
                  { x: x + SYMBOL_SIZE * 1.25, y: y + SYMBOL_SIZE / 2},
                  { x: x + SYMBOL_SIZE / 4, y: y + SYMBOL_SIZE / 2 }
              ];
              shape = new fabric.Polygon(points, {
                  fill: '#7CABE2',
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
                new ConnectionPoint({ left: shape.left + (shape.width / 2.416) - pointOffset, top: shape.top - pointOffset }),
                new ConnectionPoint({ left: shape.left + (shape.width / 10) - pointOffset, top: shape.top + (shape.height / 2) - pointOffset }),
                new ConnectionPoint({ left: shape.left + (shape.width / 1.11) - pointOffset, top: shape.top + (shape.height / 2) - pointOffset  }),
                new ConnectionPoint({ left: shape.left + (shape.width / 1.75) - pointOffset, top: shape.top + shape.height - pointOffset  }),
              ];
            break;
          default:
              break;
      }

      textObj.width = SYMBOL_SIZE;

      const group = new fabric.Group([shape, textObj, ...connections], {
        left: shape.left,
        top: shape.top,
        originX: 'center',
        originY: 'center',
        id,
        symbolType: type,
        hasControls: false
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
        for (var i = 0; i < connections.length; i++) {
          connections[i].show(canvas);
          canvas.renderAll();
        }
      });

      group.on('mouseout', () => {
        for (var i = 0; i < connections.length; i++) {
          connections[i].hide(canvas);
          canvas.renderAll();
        }
      });

      // group.addWithUpdate();
      canvas.add(group);
    },

};

export default Symbol;
