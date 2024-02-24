const SYMBOL_SIZE = 150;

const Symbol = {
  draw: (ctx, type, x, y, text) => {
    switch (type) {
        case 'Terminal':
          // Draw ellipse
          ctx.beginPath();
          ctx.ellipse(x, y, SYMBOL_SIZE / 2, SYMBOL_SIZE / 4, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#E2937B';
          ctx.fill();
          break;
        case 'Decision':
          // Draw diamond
          ctx.beginPath();
          ctx.moveTo(x, y - SYMBOL_SIZE / 3);
          ctx.lineTo(x + SYMBOL_SIZE / 1.75, y);
          ctx.lineTo(x, y + SYMBOL_SIZE / 3);
          ctx.lineTo(x - SYMBOL_SIZE / 1.75, y);
          ctx.closePath();
          ctx.fillStyle = '#E6B85F';
          ctx.fill();
          break;
        case 'Process':
          // Draw rectangle
          ctx.fillStyle = '#61C16A';
          ctx.fillRect(x - SYMBOL_SIZE / 2, y - SYMBOL_SIZE / 4, SYMBOL_SIZE, SYMBOL_SIZE / 2);
          break;
        case 'Data':
          ctx.beginPath();
          ctx.moveTo(x - SYMBOL_SIZE / 2, y - SYMBOL_SIZE / 4);
          ctx.lineTo(x + SYMBOL_SIZE / 2, y - SYMBOL_SIZE / 4);
          ctx.lineTo(x + SYMBOL_SIZE / 1.33, y + SYMBOL_SIZE / 4);
          ctx.lineTo(x - SYMBOL_SIZE / 4, y + SYMBOL_SIZE / 4)
          ctx.closePath();
          ctx.fillStyle = '#7CABE2';
          ctx.fill();
          break;
        default:
          break;
    }

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }
};

export default Symbol;
