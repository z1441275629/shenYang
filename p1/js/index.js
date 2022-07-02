var color1Dom = getId("color1");

const memoCalculateColor = (function () {
  const obj = {};
  return function (color) {
    if (obj[color]) {
      return obj[color];
    }
    obj[color] = colorTransform(color);
    return obj[color];
  }
})();

/**
 * 生成图案表格的DOM字符串
 * @param {Array} data
 * @param {{color?: string; size?: number;}} options
 * @return {string}
 */
function getPatternTable(data, options = {}) {
  // 颜色用16进制颜色的话，导出svg时报错，所以需要转换成rgb颜色
  const color = memoCalculateColor(options.color || "#000");
  const size = options.size || 10;
  let tableContent = "";
  data.forEach((row) => {
    let rowContent = "<tr>";
    row.forEach((column) => {
      rowContent += `<td style="background: ${column === 1 ? color : 'transparent'}; width: ${size}px; height: ${size}px;"></td>`;
      // rowContent += `<td style="background: ${column === 1 ? color : 'transparent'};"></td>`;
    });
    tableContent += rowContent + "</tr>";
  });
  let tableStr = `
    <table class="pattern-table">
      <tbody>
        ${tableContent}
      </tbody>
    </table>
  `;
  console.log(tableStr);
  return tableStr;
}

/**
 * 生成预览图案
 * @param {String} color
 */
function generatePreviewPattern(color = "#000") {
  
  let domStr = "";
  patterns.forEach((item) => {
    let tableStr = getPatternTable(item.data, {color});
    domStr += `
    <li class="pattern-item">
      <p class="name">${item.name}——${item.count}</p>
      ${tableStr}
    </li>
    `;
  });

  getDom(".patterns")[0].innerHTML = domStr;
}

generatePreviewPattern();

/**
 * 绑定点击图案事件
 */
function bindPickEvent() {
  [...getDom('.patterns .pattern-item')].forEach((item) => {
    item.onclick = function () {
      this.classList.toggle('active');
    }
  });
}

bindPickEvent();

/**
 * 选中的图案
 */
let pickedPatterns = [];

/**
 * 确定挑选图案
 */
function confirmPick() {
  pickedPatterns = [];
  [...getDom('.patterns .pattern-item')].forEach((item, index) => {
    if (item.classList.contains('active')) {
      pickedPatterns.push(patterns[index]);
    }
  });
  console.log(pickedPatterns, 'pickedPatterns');

  renderPickedPatterns();
}

getDom('.confirmPick')[0].onclick = confirmPick;

/**
 * 重置选中的数据
 */
function resetPick() {
  pickedPatterns = [];
  [...getDom('.patterns .pattern-item')].forEach((item, index) => {
    item.classList.remove('active');
  });
}

getDom('.clearPick')[0].onclick = resetPick;

/**
 * 渲染选中的图案
 */
function renderPickedPatterns() {
  let domStr = '';
  for (let i = 0, len = pickedPatterns.length; i < len; i++) {
    const item = pickedPatterns[i];
    domStr += `
      <li class="picked-pattern-item">
        <p class="name">${item.name}——${item.count}</p>
        ${getPatternTable(item.data, {color: "#000"})}
        <ol class="colors">
          <li class="color-item">
            <input type="color" value="#000000" />
            <button class="delete-color">删除</button>
          </li>
        </ol>
        <button class="add-color">添加颜色</button>
      </li>
    `;
  }
  getDom('.picked-patterns')[0].innerHTML = domStr;

  bindDeleteColor();
  bindAddColor();
}

/**
 * 删除颜色
 */
function bindDeleteColor() {
  [...getDom('.delete-color')].forEach((item) => {
    item.onclick = () => {
      console.log('delete')
      item.parentElement.remove();
    }
  });
}

/**
 * 添加颜色
 */
function bindAddColor() {
  [...getDom('.add-color')].forEach((item) => {
    item.onclick = () => {
      item.parentElement.getElementsByClassName('colors')[0].innerHTML += `<li class="color-item">
        <input type="color" value="#000000" />
        <button class="delete-color">删除</button>
      </li>`;

      bindDeleteColor();
    }
  });
}

/**
 * 生成空画板
 * @param {number} row 行数
 * @param {number} column 列数
 */
function generatePanel(row, column) {
  let domStr = "";
  for (let i = 0; i < row; i++) {
    let rowContent = "<tr>";
    for (let j = 0; j < column; j++) {
      rowContent += `<td></td>`;
    }
    domStr += rowContent + "</tr>";
  }

  getDom(".panel-table tbody")[0].innerHTML = domStr;
}

// /**
//  * 行数
//  */
// const rowCount = 2;
// /**
//  * 列数
//  */
// const columnCount = 5;
// generatePanel(rowCount, columnCount);

/**
 * 填充单个图案
 * @param {{data: Array; color: string;}} pattern
 * @param {{rowIndex: number; columnIndex: number;}} position
 * @param {{size: number;}} options
 */
function fillPatternToPanel(pattern, position, options) {
  const { rowIndex, columnIndex } = position;
  const td = getDom(`.panel-table > tbody > tr:nth-of-type(${rowIndex + 1}) > td:nth-of-type(${columnIndex + 1})`)[0];
  td.innerHTML = getPatternTable(pattern.data, {color: pattern.color, size: options.size});
}

/**
 * 根据选择的图案和颜色生产画布
 */
function generateRicePattern() {
  const rowCount = +getDom('.width-count')[0].value || 2;
  const columnCount = +getDom('.height-count')[0].value || 5;
  const squareWidth = +getDom('.square-width')[0].value || 10;


  let styleDom = getDom('#dynamicStyle')[0];
  if (styleDom) {
    styleDom.remove();
  }
  styleDom = document.createElement('style');
  styleDom.id = 'dynamicStyle';
  styleDom.innerHTML = `
    .panel .panel-table .pattern-table td {
      width: ${squareWidth}px;
      height: ${squareWidth}px;
    }
  `;
  document.head.appendChild(styleDom);

  // 生成空画板
  generatePanel(rowCount, columnCount);

  // 收集所有选择的图案和颜色
  const arr = [];
  for (let i = 0, len = pickedPatterns.length; i < len; i++) {
    const colors = getDom(`.picked-pattern-item:nth-of-type(${i + 1}) .color-item`);
    for (let colorIndex = 0, colorCount = colors.length; colorIndex < colorCount; colorIndex++) {
      arr.push({
        ...pickedPatterns[i],
        color: colors[colorIndex].getElementsByTagName('input')[0].value,
      })
    }
  }

  const pickedCount = arr.length;
  const totalCount = rowCount * columnCount;
  if (pickedCount > totalCount) {
    arr.length = totalCount;
  }
  if (pickedCount < totalCount) {
    const nullPattern = patterns[patterns.length - 1]; // at(-1)
    arr.length = totalCount;
    arr.fill({ ...nullPattern, color: '#000000' }, pickedCount, totalCount);
  }
  // 渲染到画布上
  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      const randomIndex = ~~(Math.random() * arr.length);
      const [{ data, color }] = arr.splice(randomIndex, 1);
      fillPatternToPanel(
        {
          data,
          color,
        },
        { rowIndex: i, columnIndex: j },
        { size: squareWidth }
      );
    }
  }
}

getDom('.generateRicePattern')[0].onclick = generateRicePattern;

const base64 = str => window.btoa(str.replace(/[\u00A0-\u2666]/g, c => `&#${c.charCodeAt(0)};`));

function downloadImg() {
  const panelDom = getDom('.panel-table')[0];
  panelDom.classList.remove('preview');
  // setTimeout(() => {
  //   html2canvas(panelDom).then(canvas => {
  //     document.body.appendChild(canvas);
  //     const url = saveAsPNG(canvas);
  //     downLoad(url, new Date().toLocaleTimeString() + '.png');
  //     panelDom.classList.add('preview');
  //   });
  // }, 30);
  
  const rowCount = +getDom('.width-count')[0].value || 2;
  const columnCount = +getDom('.height-count')[0].value || 5;
  const squareWidth = +getDom('.square-width')[0].value || 10;
  
  const scale = devicePixelRatio;
  var copyDom = panelDom.cloneNode(true);
  const width = columnCount * 11 * squareWidth;
  const height = rowCount * 13 * squareWidth;
  panelDom.style.width = width + 'px';
  panelDom.style.height = height + 'px';
  var style = `
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      table {
        border-collapse: collapse;
        border: none;
        border-spacing: 0;
      }
      td {
        border: none;
      }
      .panel-table {
        background: rgb(255, 255, 255);
      }
    </style>
  `;

  var html = copyDom.outerHTML; // replace(/%0A/g, '');
  var svgStr = `<svg xmlns="http://www.w3.org/2000/svg" charset="utf-8" width="${width}px" height="${height}px"><foreignObject width="100%" height="100%"><div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica'>${style}${html}</div></foreignObject></svg>`;
  // var svgStr = `<svg xmlns="http://www.w3.org/2000/svg" charset="utf-8" width="${width}px" height="${height}px"><foreignObject width="100%" height="100%"><div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica;transform:scale(${1 / devicePixelRatio})'>${style}${html}</div></foreignObject></svg>`;
  // var svgStr = `<svg xmlns="http://www.w3.org/2000/svg" charset="utf-8" width="${width * devicePixelRatio}px" height="${height * devicePixelRatio}px"><foreignObject width="100%" height="100%"><div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica;'>${style}${html}</div></foreignObject></svg>`;
  // var svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width / devicePixelRatio}px" height="${height / devicePixelRatio}px"><foreignObject width="100%" height="100%"><div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica'>${style}${html}</div></foreignObject></svg>`;
  var oImg = document.createElement('img');
  const src = `data:image/svg+xml,${svgStr}`;
  oImg.width = width + 'px';
  oImg.height = height + 'px';
  // oImg.src = src;
  // console.log(src);

  // getId("svg").innerHTML = svgStr;
  // getId("svg").style.transform = `scale(${1 / devicePixelRatio})`;

  // oImg.src = `data:image/svg+xml;base64,${btoa(oSvg.outerHTML)}`;

  document.body.appendChild(oImg);
  // return;
  oImg.onload = function () {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(oImg, 0, 0);
    const url = saveAsPNG(canvas);
    downLoad(url, new Date().toLocaleTimeString() + '.png');
    panelDom.classList.add('preview');
    oImg.remove();
  }
  oImg.onerror = function (err) {
    console.log(err);
  }
  oImg.src = src;
}

getDom('.download')[0].onclick = downloadImg;

/**
 * 拖拽图案设计
 * 1. 鼠标按下时，判断当前图案的横纵坐标位置，
 *    复制一个新的图案，通过定位跟随鼠标移动；
 * 2. 鼠标移动，复制的图案跟随鼠标
 * 3. 鼠标松开，判断松开鼠标的位置，将最终的位置与鼠标按下的位置相应的图案对换
 *    隐藏复制的图案
 */

const panel = getDom(".panel-table")[0];
let originRowIndex = 0;
let originColumnIndex = 0;
let clickedPattern = null;
let cloneDom = null;
let mouseToLeft = 0;
let mouseToTop = 0;

const widthCount = 11; // 每个图案宽的小正方向的数量
const heightCount = 13; // 每个图案高的小正方向的数量

/**
 * 鼠标按下
 * @param {MouseEvent} e 
 */
panel.onmousedown = function (e) {
  console.log(e);
  const { pageX, pageY } = e;
  const panelLeft = panel.offsetLeft;
  const panelTop = getPageTop(panel);

  const squareWidth = +getDom('.square-width')[0].value || 10;

  originColumnIndex = parseInt((pageX - panelLeft) / (widthCount * squareWidth));
  originRowIndex = parseInt((pageY - panelTop) / (heightCount * squareWidth));

  // console.log(originRowIndex, originColumnIndex);
  clickedPattern = getDom(`.panel-table > tbody > tr:nth-of-type(${originRowIndex + 1}) > td:nth-of-type(${originColumnIndex + 1}) .pattern-table`)[0];
  cloneDom = clickedPattern.cloneNode(true);
  let pageLeft = getPageLeft(clickedPattern);
  let pageTop = getPageTop(clickedPattern);
  cloneDom.style.cssText = `
    position: absolute;
    left: ${pageLeft - panel.offsetLeft}px;
    top: ${pageTop}px;
    opacity: 0.8;
  `;
  cloneDom.classList.add('help-pattern');
  // console.log(cloneDom);
  document.body.appendChild(cloneDom);

  mouseToLeft = pageX - pageLeft;
  mouseToTop = pageY - pageTop;
}

document.onmousemove = function (e) {
  if (!cloneDom) return;
  const { pageX, pageY } = e;
  // console.log(pageX - mouseToLeft, pageY - mouseToTop);
  // console.log(mouseToLeft, mouseToTop);
  // cloneDom.style.cssText = `
  //   left: ${pageX - mouseToLeft}px;
  //   top: ${pageY - mouseToTop}px;
  // `;
  cloneDom.style.left = `${pageX - mouseToLeft}px`;
  cloneDom.style.top = `${pageY - mouseToTop}px`;
}

document.onmouseup = function (e) {
  cloneDom && cloneDom.remove();
  cloneDom = null;
  const { pageX, pageY } = e;
  const { offsetWidth, offsetHeight } = panel;
  const pageLeft = getPageLeft(panel);
  const pageTop = getPageTop(panel);
  // 再画板区域松开鼠标，交换位置
  if (pageX > pageLeft && pageX < pageLeft + offsetWidth && pageY > pageTop && pageY < pageTop + offsetHeight) {
    const squareWidth = +getDom('.square-width')[0].value || 10;
    const y = parseInt((pageX - pageLeft) / (widthCount * squareWidth));
    const x = parseInt((pageY - pageTop) / (heightCount * squareWidth));
    exchange(
      clickedPattern,
      getDom(`.panel-table > tbody > tr:nth-of-type(${x + 1}) > td:nth-of-type(${y + 1}) .pattern-table`)[0]
    );
  }
}

/**
 * 交换两个元素
 * @param {HTMLElement} dom1 
 * @param {HTMLElement} dom2 
 */
function exchange(dom1, dom2) {
  const dom1Parent = dom1.parentNode;
  const dom2Parent = dom2.parentNode;
  var temp = dom2.cloneNode(true);
  dom1Parent.replaceChild(temp, dom1);
  dom2Parent.replaceChild(dom1, dom2);
}

/**
 * 用随机图案和随机颜色填充画布
 */
function randomFillPanel() {
  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      // console.log(
      //   {
      //     data: patterns[~~(Math.random() * patterns.length)].data,
      //     color: "#" + Math.random().toString(16).slice(-6),
      //   },
      //   { rowIndex: i, columnIndex: j }
      // );
      fillPatternToPanel(
        {
          data: patterns[~~(Math.random() * patterns.length)].data,
          color: "#" + Math.random().toString(16).slice(-6),
        },
        { rowIndex: i, columnIndex: j }
      );
    }
  }
}

// randomFillPanel();
