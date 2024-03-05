import { fabric } from 'fabric';

class ConnectionPoint extends fabric.Object {
    constructor(options) {
        super(options);
        this.set({
          objectType: 'connection',
          width: 8,
          height: 8,
          originX: 'center',
          originY: 'center',
          fill: 'transparent', // no fill color
          stroke: '#2452bd',
          strokeWidth: 1.5,
          hasControls: false,
          selectable: false,
          visible: false, // initially hidden
        });

      }

      _render(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width, this.height);
        ctx.moveTo(this.width, 0);
        ctx.lineTo(0, this.height);
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.stroke();
      }

      // _renderHover(ctx) {
      //   ctx.globalAlpha = 1; // no transparency change on hover
      //   this._render(ctx);
      //   // console.log('hovered')
      // }

      show() {
        this.set('visible', true);
        this.canvas.renderAll();
      }

      hide() {
        this.set('visible', false);
        this.canvas.renderAll();
      }

      handleMouseDown(group) {
        const line = this.draw(group);
        this.canvas.add(line);

        console.log(this.oCoords)
      }

      handleMouseOver() {
        this.hoverCircle.set('opacity', 0.5);
        switch(this.position) {
          case 'mt':
            this.hoverCursor = 'n-resize';
            break;
          case 'ml':
            this.hoverCursor = 'w-resize';
            break;
          case 'mr':
            this.hoverCursor = 'e-resize';
            break;
          case 'mb':
            this.hoverCursor = 's-resize';
            break;
        }
        // this.canvas.renderAll();
      }

      handleMouseOut() {
        this.hoverCircle.set('opacity', 0);
        // this.canvas.renderAll();
      }

      // checkCanvas() {
      //   console.log(this.canvas);
      // }
      draw(group) {
        console.log('create line');
        console.log(group)
        const point = group.oCoords[this.position];
        console.log(point);
        // create arrow
        const line = new fabric.Line([point.x, point.y, point.x + 500, point.y + 0], {
          stroke: 'black',
          strokeWidth: 2,
          hasControls: false,
          selectable: true,
        });

        console.log(group.oCoords);
        return line;

      }

  }

  export default ConnectionPoint;
