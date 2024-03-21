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
          fromConnected: false,
          toConnected: false
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
        const startingPoint = this.draw(group);
        return startingPoint;
        // this.canvas.add(line);

        // console.log(group);
        // console.log(this);
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

      draw(group) {
        // console.log('create line');
        const point = group.oCoords[this.position];
        const tl = group.oCoords['tl'];// top left
        // const br = group.oCoords['br'];// bottom right
        // console.log('point', point);

        let x;
        let y;

        switch(this.position) {
          case 'mt':
            x = point.x;
            y = point.y + 1.5; //stroke
            break;
          case 'ml':
            x = point.x + 1.5;
            y = point.y;
            break;
          case 'mr':
            x = point.x - 1.5
            y = point.y;
            break;
          case 'mb':
            x = point.x
            y = point.y - 1.5;
            break;
        }

        if (this.position === 'mt' && group.symbolType === "Data") {
          // const x2 = tl.x + group.size;
          // x = (tl.x + x2) / 2;
          // console.log('tl', tl.x);
          // x = (tl.x + br.x) / 2;
          x = x + 2;
        }
        if (this.position === 'ml' && group.symbolType === "Data") {
          x = tl.x + (group.size / 8);
        }
        else if (this.position === 'mr' && group.symbolType === "Data") {
          x = tl.x + (group.size + (group.size * .125));
        }
        else if (this.position === 'mb' && group.symbolType === "Data") {
          // const x1 = tl.x + (group.size / 4);
          // x = (x1 + br.x) / 2;
          // x = (tl.x + br.x) / 2;
          x = x + 2;
        }

        const startingPoint = {x, y};

        // console.log(group.oCoords);
        return startingPoint;

      }

  }

  export default ConnectionPoint;
