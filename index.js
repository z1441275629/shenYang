var color1Dom = getId('color1');
var color2Dom = getId('color2');
var color3Dom = getId('color3');
var color4Dom = getId('color4');
var widthDom = getId('width');
var countDom = getId('count');
var confirmBtn = getId('confirm');
var canvas = getId('canvas');
var savePngBtn = getId('savePng');
var saveJpgBtn = getId('saveJpg');

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

function getId(id) {
  return document.getElementById(id);
}

/**
 * @author web得胜
 * @param {String} url 需要下载的文件地址
 * */
 function downLoad(url, fileName){
  var oA = document.createElement("a");
  oA.download = fileName || '';// 设置下载的文件名，默认是'下载'
  oA.href = url;
  document.body.appendChild(oA);
  oA.click();
  oA.remove(); // 下载之后把创建的元素删除
}

// 保存成png格式的图片
function saveAsPNG(canvas) {
  return canvas.toDataURL("image/png");
}

// 保存成jpg格式的图片
function saveAsJPG(canvas) {
  return canvas.toDataURL("image/jpeg");
}

confirmBtn.onclick = clickConfirm;

savePngBtn.onclick = function () {
  var url = saveAsPNG(canvas);
  downLoad(url, Math.random().toString().slice(-6) + '.png');
}

saveJpgBtn.onclick = function () {
  var url = saveAsJPG(canvas);
  downLoad(url, Math.random().toString().slice(-6) + '.jpg');
}
