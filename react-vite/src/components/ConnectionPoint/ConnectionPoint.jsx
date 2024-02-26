import { fabric } from 'fabric';

class ConnectionPoint extends fabric.Object {
    constructor(options) {
        super(options);
        this.set({
          type: 'connection',
          width: 5,
          height: 5,
          originX: 'center',
          originY: 'center',
          fill: 'transparent', // no fill color
          stroke: '#3e77d4',
          strokeWidth: 2,
          hasControls: false,
          selectable: false,
          visible: false, // initially hidden
          hoverCircle: new fabric.Circle({
            radius: 15,
            fill: 'green',
            opacity: 0, // initially invisible
          }),
        });

        this.hoverCircle.set({
            left: this.left - this.hoverCircle.radius,
            top: this.top - this.hoverCircle.radius,
        });
      }

      _render(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width, this.height);
        ctx.moveTo(this.width, 0);
        ctx.lineTo(0, this.height);
        ctx.stroke();
      }

      _renderHover(ctx) {
        ctx.globalAlpha = 1; // no transparency change on hover
        this._render(ctx);
      }

      show(canvas) {
        this.set('visible', true);
        canvas.renderAll();
      }

      hide(canvas) {
        this.set('visible', false);
        canvas.renderAll();
      }

  }

  export default ConnectionPoint;
