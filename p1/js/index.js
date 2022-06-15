var color1Dom = getId('color1');

// 生成预览图案
function generatePreviewPattern (color = "#000") {
  let domStr = '';
  patterns.forEach(item => {
    let tableContent = '';
    item.data.forEach(row => {
      let rowContent = '<tr>';
      row.forEach(column => {
        rowContent += `<td style="background: ${column === 1 ? color : '' }"></td>`;
      });
      tableContent += rowContent + '</tr>';
    });
    domStr += `
      <li class="pattern-item">
        <p class="name">${item.name}</p>
        <table class="pattern-preview">
          <tbody>
            ${tableContent}
          </tbody>
        </table>
      </li>
    `;
  });

  getDom('.patterns')[0].innerHTML = domStr;
}

generatePreviewPattern();

function clickConfirm() {
  var color1 = color1Dom.value;
  var color2 = color2Dom.value;
  var color3 = color3Dom.value;
  var color4 = color4Dom.value;
  var smallSquareWidth = +widthDom.value || 20;
  var sideSquareCount = +countDom.value || 10;

  var width = smallSquareWidth * 2 * sideSquareCount
  canvas.width = width;
  canvas.height = width;

  var ctx = canvas.getContext('2d');
  console.log(ctx)
  for (var row = 0; row < sideSquareCount; row ++) {
    for (var column = 0; column < sideSquareCount; column ++) {
      var x0 = column * smallSquareWidth * 2;
      var y0 = row * smallSquareWidth * 2;
      var colors = [color1, color2, color3, color4];
      for (var index = 0; index < 4; index ++) {
        var x1 = x0 + (index % 2) * smallSquareWidth;
        var y1 = y0 + ~~(index / 2) * smallSquareWidth;
        var randomIndex = (Math.random() * colors.length) >> 0;
        // var color = colors.splice(randomIndex, 1)[0]; // 局部小正方形随机
        var color = colors[randomIndex]; // 每一个位置随机颜色
        // console.log(`%c${color}`, `color: ${color}`)；
        ctx.fillStyle = color;
        ctx.fillRect(x1, y1, smallSquareWidth, smallSquareWidth);
      }
    }
  }
}
