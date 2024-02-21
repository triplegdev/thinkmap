const Symbol = {
  draw: (ctx, type, x, y) => {
    switch (type) {
      case 'Terminal':
        ctx.beginPath();
        ctx.ellipse(x, y, 40, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#E2937B';
        ctx.fill();
        break;
      case 'Decision':
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x + 20, y);
        ctx.lineTo(x, y + 20);
        ctx.lineTo(x - 20, y);
        ctx.closePath();
        ctx.fillStyle = '#E6B85F';
        ctx.fill();
        break;
      case 'Process':
        ctx.fillStyle = '#61C16A';
        ctx.fillRect(x - 20, y - 10, 40, 20);
        break;
      case 'Data':
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 10);
        ctx.lineTo(x + 20, y - 10);
        ctx.lineTo(x + 10, y + 10);
        ctx.lineTo(x - 30, y + 10);
        ctx.closePath();
        ctx.fillStyle = '#7CABE2';
        ctx.fill();
        break;
      default:
        break;
    }
  }
};

export default Symbol;
