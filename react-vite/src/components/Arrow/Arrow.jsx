import { fabric } from "fabric";

fabric.ArrowLine = fabric.util.createClass(fabric.Line, {

    initialize: function(points, options) {
        this.callSuper("initialize", points, options)
        this.set({type:'arrow'});
      },

    _render: function(ctx) {
        ctx.beginPath();
        const r = this.calcLinePoints();
        const headlen = 8;   // length of head in pixels
        const angle = Math.atan2(r.y2-r.y1,r.x2-r.x1);
        ctx.moveTo(r.x1, r.y1);
        ctx.lineTo(r.x2, r.y2);
        ctx.lineTo(r.x2-headlen*Math.cos(angle-Math.PI/6),r.y2-headlen*Math.sin(angle-Math.PI/6));
        ctx.moveTo(r.x2, r.y2);
        ctx.lineTo(r.x2-headlen*Math.cos(angle+Math.PI/6),r.y2-headlen*Math.sin(angle+Math.PI/6));

        ctx.lineWidth = this.strokeWidth;
        const s = ctx.strokeStyle;
        ctx.strokeStyle = this.stroke || ctx.fillStyle, this.stroke && this._renderStroke(ctx), ctx.strokeStyle = s
        },
});

export default fabric.ArrowLine;
